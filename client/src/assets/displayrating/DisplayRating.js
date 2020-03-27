import React, { Component } from "react";
import ZeroStars from "../../assets/images/restaurantratings/zerostars.png";
import OneStar from "../../assets/images/restaurantratings/onestar.png";
import TwoStars from "../../assets/images/restaurantratings/twostars.png";
import ThreeStars from "../../assets/images/restaurantratings/threestars.png";
import FourStars from "../../assets/images/restaurantratings/fourstars.png";
import FiveStars from "../../assets/images/restaurantratings/fivestars.png";

export default class DisplayRating extends Component {
  render() {
    switch (this.props.rating) {
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
}
