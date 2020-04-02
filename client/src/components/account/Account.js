//Import libraries
import React, { Component } from "react";
import { Link, Route, useRouteMatch, Redirect } from "react-router-dom";

//Import components
import Navbar from "../nav/Navbar";
import Profile from "./profile/Profile";
import CreditCard from "./creditcard/CreditCard";
import Address from "./address/Address";
import Footer from "../footer/Footer";

//Import assets
import Loader from "../../assets/loader/Loader";

//Import utilities
import GetLogin from "../../utils/GetLogin";

//Import stylesheets
import "./Account.css";

//This method renders non-clickable plain text in the sidebar if the
//current URL matches the route for that particular link. Otherwise,
//it will render a link to that URL.
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
    this.state = {};

    //Get the "user" and "isUserLoaded" state variables from the GetLogin utility
    GetLogin(this.setState.bind(this));
  }

  render() {
    if (this.state.isUserLoaded) {
      if (this.state.user) {
        return (
          <div>
            <div className="accountcontainer">
              <Navbar user={this.state.user} />
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
                    <CustomLink
                      to="/account/address"
                      label="Address and phone"
                    />
                  </li>
                </ul>
              </div>
              <div className="accountrightpane">
                <Route
                  exact
                  path="/account/"
                  render={props => (
                    <Profile {...props} user={this.state.user} />
                  )}
                />
                <Route
                  path="/account/profile"
                  render={props => (
                    <Profile {...props} user={this.state.user} />
                  )}
                />
                <Route
                  path="/account/card"
                  render={props => (
                    <CreditCard {...props} user={this.state.user} />
                  )}
                />
                <Route
                  path="/account/address"
                  render={props => (
                    <Address {...props} user={this.state.user} />
                  )}
                />
              </div>
            </div>
            <Footer />
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
