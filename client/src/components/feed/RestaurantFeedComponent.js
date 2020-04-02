import React, { Component } from "react";
import RestaurantFeedPlaceholder from "./restaurantfeed-placeholder.png";
import DisplayPrice from "../../assets/displayprice/DisplayPrice";
import DisplayRating from "../../assets/displayrating/DisplayRating";
import "./RestaurantFeedComponent.css";

export default class RestaurantFeedComponent extends Component {
  render() {
    return (
      <div className="RestaurantFeedComponentContainer">
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
          <div className="RestaurantFeedComponentContentRight">xx.xx miles</div>
        </div>
      </div>
    );
  }
}
