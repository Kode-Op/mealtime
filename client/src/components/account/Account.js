//Import libraries
import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

//Import components
import Navbar from "../nav/Navbar";
import Profile from "./profile/Profile";
import CreditCard from "./creditcard/CreditCard";
import Address from "./address/Address";
import OrderHistory from "../orderhistory/OrderHistory";
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
    this.state = {};
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
                      to="/account/orderhistory"
                      label="View Order History"
                    />
                  </li>
                </ul>
              </div>
              <div className="accountrightpane">
                <Route
                  exact
                  path="/account/"
                  render={(props) => (
                    <Profile {...props} user={this.state.user} />
                  )}
                />
                <Route
                  path="/account/profile"
                  render={(props) => (
                    <Profile {...props} user={this.state.user} />
                  )}
                />
                <Route
                  path="/account/card"
                  render={(props) => (
                    <CreditCard {...props} user={this.state.user} />
                  )}
                />
                <Route
                  path="/account/address"
                  render={(props) => (
                    <Address {...props} user={this.state.user} />
                  )}
                />
                <Route
                  path="/account/orderhistory"
                  render={(props) => (
                    <OrderHistory {...props} user={this.state.user} />
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
