import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import RestaurantFeedPlaceholder from "./restaurantfeed-placeholder.png";
import DisplayPrice from "../../assets/displayprice/DisplayPrice";
import DisplayRating from "../../assets/displayrating/DisplayRating";
import "./RestaurantFeedComponent.css";

export default class RestaurantFeedComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { redirect: false };
  }

  viewRestaurant = () => {
    this.setState({ redirect: true });
  };

  render() {
    if (!this.state.redirect) {
      return (
        <div
          className="RestaurantFeedComponentContainer"
          onClick={this.viewRestaurant}
        >
          <div className="RestaurantFeedComponentImage">
            <img src={RestaurantFeedPlaceholder} alt="" />
          </div>
          <div className="RestaurantFeedComponentContent">
            <div className="RestaurantFeedComponentContentLeft">
              <h5>{this.props.restaurant.name}</h5>
              <DisplayRating rating={this.props.restaurant.rating} />
              <br />
              <DisplayPrice price={this.props.restaurant.price} />
            </div>
            <div className="RestaurantFeedComponentContentRight">
              xx.xx miles
            </div>
          </div>
        </div>
      );
    } else {
      return <Redirect to={"/restaurant?id=" + this.props.restaurant._id} />;
    }
  }
}
