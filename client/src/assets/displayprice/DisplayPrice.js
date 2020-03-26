import React, { Component } from "react";
import ZeroDollars from "../../assets/images/restaurantprices/zerodollars.png";
import OneDollar from "../../assets/images/restaurantprices/onedollar.png";
import TwoDollars from "../../assets/images/restaurantprices/twodollars.png";
import ThreeDollars from "../../assets/images/restaurantprices/threedollars.png";
import FourDollars from "../../assets/images/restaurantprices/fourdollars.png";
import FiveDollars from "../../assets/images/restaurantprices/fivedollars.png";

//Takes in a value, 1-5, and displays that many stars
export default class DisplayPrice extends Component {
  render() {
    switch (this.props.price) {
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
}
