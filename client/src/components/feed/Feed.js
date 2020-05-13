//Import libraries
import React, { Component } from "react";
import { Redirect } from "react-router-dom";

//Import components
import Navbar from "../nav/Navbar";
import FeedAddressOverlay from "./FeedAddressOverlay";
import RestaurantFeedComponent from "./RestaurantFeedComponent";
import Footer from "../footer/Footer";

//Import assets
import Loader from "../../assets/loader/Loader";

//Import utilities
import { UpdateUserAddress, UpdateUserTags } from "../../utils/axios/Users";
import { GetFilteredRestaurants } from "../../utils/axios/Restaurants";
import GetLogin from "../../utils/GetLogin";

//Import stylesheets
import "./Feed.css";

export default class Feed extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      areRestaurantsLoaded: false,
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

        //Get the restaurants, sorted by user preference, using the response ID.
        const pkg = {
          userId: response._id,

          //Default values
          tags: [],
          ratings: 0,
          priceLow: 0,
          priceHigh: 0,
        };

        GetFilteredRestaurants(pkg)
          .then((response) => {
            if (this._isMounted) {
              this.setState({
                restaurants: response.data,
                areRestaurantsLoaded: true,
              });
            }
          })
          .catch(() => {
            if (this._isMounted) {
              this.setState({
                areRestaurantsLoaded: true,
              });
            }
          });
      })

      //User did not load
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

  //Update user address. This function is passed down as a prop to
  //FeedAddressOverlay.js
  updateAddressHandler = (newAddress, tags) => {
    const pkg = {
      address: newAddress,
    };
    UpdateUserAddress(this.state.user._id, pkg)
      .then(() => {
        const pkg2 = {
          tags: tags,
        };
        UpdateUserTags(this.state.user._id, pkg2)
          .then(() => {
            window.location.reload(true);
          })
          .catch((error) => {
            console.log(error);
            //Update the state with the new value
            if (this._isMounted) {
              this.setState((prevState) => ({
                user: {
                  ...prevState.user,
                  address: newAddress,
                },
              }));
            }
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //This method renders a restaurant for each object found in the "restaurants"
  getRestaurantFeed = () => {
    const { areRestaurantsLoaded, restaurants } = this.state;

    if (areRestaurantsLoaded) {
      return restaurants.map((currentRestaurant) => {
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

  //This method disables the scrollbar and renders a popup if the address is not set.
  //Expected to occur on first login.
  renderFeedAddressOverlay = (address) => {
    if (address === "") {
      document.body.style.overflow = "hidden";
      return (
        <FeedAddressOverlay updateAddressHandler={this.updateAddressHandler} />
      );
    }
  };

  render() {
    const { isUserLoaded, user } = this.state;

    if (isUserLoaded) {
      if (user) {
        return (
          <div>
            <Navbar user={user} />
            {this.renderFeedAddressOverlay(user.address)}

            <div className="FeedContainer">
              <h4>What do you want to eat?</h4>
              <div className="FeedRestaurantContainer">
                {this.getRestaurantFeed()}
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
