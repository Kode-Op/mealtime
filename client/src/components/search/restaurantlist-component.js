//Import libraries
import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import { Redirect } from "react-router-dom";

//Import assets
import RestaurantImagePlaceholder from "./restaurantimageplaceholder.png";
import DisplayPrice from "../../assets/displayprice/DisplayPrice";
import DisplayRating from "../../assets/displayrating/DisplayRating";

//Import stylesheet
import "./restaurantlist-component.css";

export default class RestaurantListComponent extends Component {
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
        <ListGroup.Item
          className="RestaurantListComponentItem"
          onClick={this.viewRestaurant}
        >
          <img
            src={RestaurantImagePlaceholder}
            className="RestaurantListComponentImage"
            alt=""
          />
          <div className="RestaurantListComponentName">
            {this.props.restaurant.name}
          </div>
          <div className="RestaurantListGrouping">
            <div className="RestaurantListComponentRating">
              <DisplayRating rating={this.props.restaurant.rating} />
            </div>
            <div className="RestaurantListComponentPrice">
              <DisplayPrice price={this.props.restaurant.price} />
            </div>
            <div className="RestaurantListComponentDistance">xx.xx miles</div>
          </div>
        </ListGroup.Item>
      );
    } else {
      return <Redirect to={"/restaurant?id=" + this.props.restaurant._id} />;
    }
  }
}
