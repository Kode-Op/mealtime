//Import libraries
import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

//Import components
import Navbar from "../nav/Navbar";
import Profile from "./profile/Profile";
import CreditCard from "./creditcard/CreditCard";
import Address from "./address/Address";
import UserOrderHistory from "../orderhistory/UserOrderHistory";
import Footer from "../footer/Footer";
import RouteLink from "../routelink/RouteLink";

//Import assets
import Loader from "../../assets/loader/Loader";

//Import utilities
import GetLogin from "../../utils/GetLogin";

//Import stylesheets
import "./Account.css";

export default class Account extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      user: [],
      isUserLoaded: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    //Get "user" and "isUserLoaded" from the GetLogin utility
    GetLogin()
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            isUserLoaded: true,
            user: response,
          });
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            isUserLoaded: true,
          });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { isUserLoaded, user } = this.state;

    if (isUserLoaded) {
      if (user) {
        return (
          <div>
            <div className="accountcontainer">
              <Navbar user={user} />
              <div className="accountleftpane">
                <h2>Your account</h2>
                <ul>
                  <li>
                    <RouteLink to="/account/profile" label="Profile" />
                  </li>
                  <li>
                    <RouteLink
                      to="/account/card"
                      label="Credit card information"
                    />
                  </li>
                  <li>
                    <RouteLink
                      to="/account/address"
                      label="Address and phone"
                    />
                  </li>
                  <li>
                    <RouteLink
                      to="/account/history"
                      label="View Order History"
                    />
                  </li>
                </ul>
              </div>
              <div className="accountrightpane">
                <Route
                  exact
                  path="/account/"
                  render={(props) => <Profile {...props} user={user} />}
                />
                <Route
                  path="/account/profile"
                  render={(props) => <Profile {...props} user={user} />}
                />
                <Route
                  path="/account/card"
                  render={(props) => <CreditCard {...props} user={user} />}
                />
                <Route
                  path="/account/address"
                  render={(props) => <Address {...props} user={user} />}
                />
                <Route
                  path="/account/history"
                  render={(props) => (
                    <UserOrderHistory {...props} user={user} />
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
