//Import libraries
import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import { Redirect } from "react-router-dom";

//Import assets
import RestaurantImagePlaceholder from "../../assets/images/restaurantlist/restaurantimageplaceholder.png";
import DisplayPrice from "../../assets/displayprice/DisplayPrice";
import DisplayRating from "../../assets/displayrating/DisplayRating";

//Import stylesheet
import "./restaurantlist-component.css";

export default class RestaurantListComponent extends Component {
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
        <ListGroup.Item
          className="RestaurantListComponentItem"
          onClick={this.viewRestaurant}
        >
          <img
            src={
              "https://mealtimebucket.s3-us-west-1.amazonaws.com/" +
              restaurant._id +
              "/small.png"
            }
            onError={(e) => {
              e.target.setAttribute("src", RestaurantImagePlaceholder);
              e.target.onerror = null;
            }}
            className="RestaurantListComponentImage"
            alt="No restaurant found"
            style={{ width: 100 }}
          />
          <div className="RestaurantListComponentName">{restaurant.name}</div>
          <div className="RestaurantListGrouping">
            <div className="RestaurantListComponentRating">
              <DisplayRating rating={restaurant.rating} />
            </div>
            <div className="RestaurantListComponentPrice">
              <DisplayPrice price={restaurant.price} />
            </div>
          </div>
        </ListGroup.Item>
      );
    } else {
      return <Redirect to={"/restaurant?id=" + restaurant._id} />;
    }
  }
}
