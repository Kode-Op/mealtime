//Import libraries
import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

//Import components
import Navbar from "../nav/Navbar";
import Footer from "../footer/Footer";
import ManageRestaurants from "./restaurants/ManageRestaurants";
import ManageMenuItems from "./menuitems/ManageMenuItems";
import RouteLink from "../routelink/RouteLink";
import RestaurantOrderHistory from "../orderhistory/RestaurantOrderHistory";

//Import assets
import Loader from "../../assets/loader/Loader";

//Import utilities
import GetLogin from "../../utils/GetLogin";

export default class RestaurantAccount extends Component {
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
      if (Object.keys(user).length > 0) {
        return (
          <div>
            <div className="accountcontainer">
              <Navbar user={user} />
              <div className="accountleftpane">
                <h2>Your restaurants</h2>
                <ul>
                  <li>
                    <RouteLink
                      to="/manage/restaurants"
                      label="Manage Restaurants"
                    />
                  </li>
                  <li>
                    <RouteLink
                      to="/manage/menuitems"
                      label="Manage Menu Items"
                    />
                  </li>
                  <li>
                    <RouteLink
                      to="/manage/history"
                      label="View Order History"
                    />
                  </li>
                </ul>
              </div>
              <div className="accountrightpane">
                <Route
                  exact
                  path="/manage/"
                  render={(props) => (
                    <ManageRestaurants {...props} user={user} />
                  )}
                />
                <Route
                  path="/manage/restaurants"
                  render={(props) => (
                    <ManageRestaurants {...props} user={user} />
                  )}
                />
                <Route
                  path="/manage/menuitems"
                  render={(props) => <ManageMenuItems {...props} user={user} />}
                />
                <Route
                  path="/manage/history"
                  render={(props) => (
                    <RestaurantOrderHistory {...props} user={user} />
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
