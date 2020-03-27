import React, { Component } from "react";
import { Link, Route, useRouteMatch, Redirect } from "react-router-dom";
import Navbar from "../../components/nav/Navbar";
import Profile from "./profile/Profile";
import CreditCard from "./creditcard/CreditCard";
import { getFromStorage } from "../../utils/storage";
import axios from "axios";
import Address from "./address/Address";
import Loader from "../../assets/loader/Loader";
import "./Account.css";

function CustomLink({ to, label }) {
  let routematch = useRouteMatch({
    path: to
  });

  if (routematch) {
    return <div style={{ cursor: "default" }}>{label}</div>;
  } else {
    return <Link to={to}>{label}</Link>;
  }
}

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoaded: false, loggedin: false, user: [] };
  }

  componentDidMount() {
    window.addEventListener("resize", this.getMobileView, false);

    //Check to see if logged in
    const obj = getFromStorage("mealtime");
    let token = "";
    if (obj !== null) {
      token = obj.token;
      // Verify token
      axios
        .get("/api/users/verify/" + token)
        .then(tokenResponse => {
          if (tokenResponse.data.success) {
            axios
              .get("/api/users/getUser/" + token)
              .then(userResponse => {
                axios
                  .get("/api/users/" + userResponse.data.userId)
                  .then(idResponse => {
                    this.setState({
                      loggedin: true,
                      isLoaded: true,
                      user: idResponse
                    });
                  })
                  .catch(error => {
                    this.setState({ isLoaded: true, loggedin: false });
                    console.log("Error in getting /api/users: " + error);
                  });
              })
              .catch(error => {
                this.setState({ isLoaded: true, loggedin: false });
                console.log("Error in getting /api/users/getUser: " + error);
              });
          } else {
            this.setState({ isLoaded: true, loggedin: false });
            console.log("Error in getting /api/users/verify");
          }
        })
        .catch(error => {
          this.setState({ isLoaded: true, loggedin: false });
          console.log(error);
        });
    } else {
      this.setState({ isLoaded: true, loggedin: false });
      console.log("User isn't logged in");
    }
  }

  render() {
    if (this.state.isLoaded) {
      if (this.state.loggedin) {
        return (
          <div className="accountcontainer">
            <Navbar />
            <div className="accountleftpane">
              <h2>Your account</h2>
              <ul>
                <li>
                  <CustomLink to="/account/profile" label="Profile" />
                </li>
                <li>
                  <CustomLink
                    to="/account/card"
                    label="Credit card information"
                  />
                </li>
                <li>
                  <CustomLink to="/account/address" label="Address and phone" />
                </li>
              </ul>
            </div>
            <div className="accountrightpane">
              <Route
                exact
                path="/account/"
                render={props => <Profile {...props} user={this.state.user} />}
              />
              <Route
                path="/account/profile"
                render={props => <Profile {...props} user={this.state.user} />}
              />
              <Route
                path="/account/card"
                render={props => (
                  <CreditCard {...props} user={this.state.user} />
                )}
              />
              <Route
                path="/account/address"
                render={props => <Address {...props} user={this.state.user} />}
              />
            </div>
          </div>
        );
      } else {
        return <Redirect to="/" />;
      }
    } else {
      return <Loader />;
    }
  }
}
