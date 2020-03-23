//Import libraries
import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";

//Import assets
import RestaurantImagePlaceholder from "./restaurantimageplaceholder.png";
import ZeroStars from "./zerostars.png";
import OneStar from "./onestar.png";
import TwoStars from "./twostars.png";
import ThreeStars from "./threestars.png";
import FourStars from "./fourstars.png";
import FiveStars from "./fivestars.png";
import ZeroDollars from "./zerodollars.png";
import OneDollar from "./onedollar.png";
import TwoDollars from "./twodollars.png";
import ThreeDollars from "./threedollars.png";
import FourDollars from "./fourdollars.png";
import FiveDollars from "./fivedollars.png";

//Import stylesheet
import "./restaurantlist-component.css";

//Takes in a value, 0-5, and displays that many dollar signs
function DisplayPrice({ price }) {
  switch (price) {
    case 0:
      return <img src={ZeroDollars} alt="0/5" />;
    case 1:
      return <img src={OneDollar} alt="1/5" />;
    case 2:
      return <img src={TwoDollars} alt="2/5" />;
    case 3:
      return <img src={ThreeDollars} alt="3/5" />;
    case 4:
      return <img src={FourDollars} alt="4/5" />;
    case 5:
      return <img src={FiveDollars} alt="5/5" />;
    default:
      return <div>No price information found.</div>;
  }
}

//Takes in a value, 1-5, and displays that many stars
function DisplayRating({ rating }) {
  switch (rating) {
    case 1:
      return <img src={OneStar} alt="1/5" />;
    case 2:
      return <img src={TwoStars} alt="2/5" />;
    case 3:
      return <img src={ThreeStars} alt="3/5" />;
    case 4:
      return <img src={FourStars} alt="4/5" />;
    case 5:
      return <img src={FiveStars} alt="5/5" />;
    default:
      return <img src={ZeroStars} alt="" />;
  }
}

export default class RestaurantListComponent extends Component {
  render() {
    return (
      <ListGroup.Item className="RestaurantListComponentItem">
        <img
          src={RestaurantImagePlaceholder}
          className="RestaurantListComponentImage"
          alt=""
        />
        <div className="RestaurantListComponentName">
          {this.props.restaurant.name}
        </div>
        <div className="RestaurantListComponentRating">
          <DisplayRating rating={this.props.restaurant.rating} />
        </div>
        <div className="RestaurantListComponentNumReviews">
          {this.props.restaurant.review.length} reviews
        </div>
        <div className="RestaurantListComponentPrice">
          <DisplayPrice price={this.props.restaurant.price} />
        </div>
        <div className="RestaurantListComponentDistance">xx.xx miles</div>
      </ListGroup.Item>
    );
  }
}
