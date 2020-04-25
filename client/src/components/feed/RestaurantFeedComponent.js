//Import libraries
import React, { Component } from "react";
import { Redirect } from "react-router-dom";

//Import assets
import RestaurantFeedPlaceholder from "./restaurantfeed-placeholder.png";
import DisplayPrice from "../../assets/displayprice/DisplayPrice";
import DisplayRating from "../../assets/displayrating/DisplayRating";

//Import stylesheets
import "./RestaurantFeedComponent.css";

export default class RestaurantFeedComponent extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //This method sets the variable redirect to true after clicking on this particular restaurant
  viewRestaurant = () => {
    if (this._isMounted) {
      this.setState({
        redirect: true,
      });
    }
  };

  render() {
    const { redirect } = this.state;
    const { restaurant } = this.props;

    if (!redirect) {
      return (
        <div
          className="RestaurantFeedComponentContainer"
          onClick={this.viewRestaurant}
        >
          <div className="RestaurantFeedComponentImage">
            <img
              src={
                "https://mealtimebucket.s3-us-west-1.amazonaws.com/" +
                restaurant._id +
                "/large.png"
              }
              onError={(e) => {
                e.target.setAttribute("src", RestaurantFeedPlaceholder);
                e.target.onerror = null;
              }}
              alt="No restaurant found"
            />
          </div>
          <div className="RestaurantFeedComponentContent">
            <div className="RestaurantFeedComponentContentLeft">
              <h5>{restaurant.name}</h5>
              <DisplayRating rating={restaurant.rating} />
              <br />
              <DisplayPrice price={restaurant.price} />
            </div>
          </div>
        </div>
      );
    } else {
      return <Redirect to={"/restaurant?id=" + restaurant._id} />;
    }
  }
}
