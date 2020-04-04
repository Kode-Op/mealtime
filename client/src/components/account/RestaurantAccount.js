//Import libraries
import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

//Import components
import Navbar from "../nav/Navbar";
import Footer from "../footer/Footer";
import ManageRestaurants from "./restaurants/ManageRestaurants";
import ManageMenuItems from "./menuitems/ManageMenuItems";
import RouteLink from "../routelink/RouteLink";

//Import assets
import Loader from "../../assets/loader/Loader";

//Import utilities
import GetLogin from "../../utils/GetLogin";

export default class RestaurantAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    //Get "user" and "isUserLoaded" from the GetLogin utility
    GetLogin.then((response) => {
      this.setState({
        isUserLoaded: true,
        user: response,
      });
    }).catch(() => {
      this.setState({
        isUserLoaded: true,
      });
    });
  }

  render() {
    if (this.state.userObj.isUserLoaded) {
      if (this.state.userObj.user) {
        return (
          <div>
            <div className="accountcontainer">
              <Navbar user={this.state.userObj.user} />
              <div className="accountleftpane">
                <h2>Your account</h2>
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
                </ul>
              </div>
              <div className="accountrightpane">
                <Route
                  exact
                  path="/manage/"
                  render={(props) => (
                    <ManageRestaurants
                      {...props}
                      user={this.state.userObj.user}
                    />
                  )}
                />
                <Route
                  path="/manage/restaurants"
                  render={(props) => (
                    <ManageRestaurants
                      {...props}
                      user={this.state.userObj.user}
                    />
                  )}
                />
                <Route
                  path="/manage/menuitems"
                  render={(props) => (
                    <ManageMenuItems
                      {...props}
                      user={this.state.userObj.user}
                    />
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
