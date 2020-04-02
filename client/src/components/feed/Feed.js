import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GetLogin from "../../utils/GetLogin";
import Navbar from "../nav/Navbar";
import Loader from "../../assets/loader/Loader";
import FeedAddressOverlay from "./FeedAddressOverlay";
import RestaurantFeedComponent from "./RestaurantFeedComponent";
import axios from "axios";
import "./Feed.css";

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = { restaurants: [], areRestaurantsLoaded: false };
    GetLogin(this.setState.bind(this));
  }

  componentDidMount() {
    axios
      .get("/api/restaurants")
      .then(response => {
        this.setState({
          restaurants: response.data,
          areRestaurantsLoaded: true
        });
      })
      .catch(() => {
        this.setState({ areRestaurantsLoaded: true });
      });
  }

  updateAddressHandler = newAddress => {
    /* Update user's address
    // API route needs to be updated so that a password isn't required in this circumstance
    // Uncomment after that is completed
    let pkg = {
      address: newAddress,
      password: 
    };
    axios
      .post("/api/users/updateAddress/" + this.state.user._id, pkg)
      .then()
      .catch(error => {
        console.log(error);
      });
    */

    this.setState(prevState => ({
      user: {
        ...prevState.user,
        address: newAddress
      }
    }));
  };

  getRestaurantFeed = () => {
    //For now, we'll render every restaurant
    if (this.state.areRestaurantsLoaded) {
      return this.state.restaurants.map(currentRestaurant => {
        return (
          <RestaurantFeedComponent
            restaurant={currentRestaurant}
            key={currentRestaurant._id}
          />
        );
      });
    } else {
      return <Loader />;
    }
  };

  render() {
    if (this.state.isUserLoaded) {
      if (this.state.user) {
        if (this.state.user.address === "") {
          return (
            <div>
              <Navbar user={this.state.user} />
              <FeedAddressOverlay
                updateAddressHandler={this.updateAddressHandler}
              />
            </div>
          );
        } else {
          return (
            <div>
              <Navbar user={this.state.user} />
              <div className="FeedContainer">
                <h4>What do you want to eat?</h4>
                <div className="FeedRestaurantContainer">
                  {this.getRestaurantFeed()}
                </div>
              </div>
            </div>
          );
        }
      } else {
        return <Redirect to="/" />;
      }
    } else {
      return <Loader />;
    }
  }
}
