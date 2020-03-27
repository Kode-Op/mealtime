import React, { Component } from "react";
import ZeroStars from "../../assets/images/restaurantratings/zerostars.png";
import HalfStar from "../../assets/images/restaurantratings/halfstar.png";
import OneStar from "../../assets/images/restaurantratings/onestar.png";
import OneHalfStar from "../../assets/images/restaurantratings/onehalfstars.png";
import TwoStars from "../../assets/images/restaurantratings/twostars.png";
import TwoHalfStars from "../../assets/images/restaurantratings/twohalfstars.png";
import ThreeStars from "../../assets/images/restaurantratings/threestars.png";
import ThreeHalfStars from "../../assets/images/restaurantratings/threehalfstars.png";
import FourStars from "../../assets/images/restaurantratings/fourstars.png";
import FourHalfStars from "../../assets/images/restaurantratings/fourhalfstars.png";
import FiveStars from "../../assets/images/restaurantratings/fivestars.png";

export default class DisplayRating extends Component {
  render() {
    switch (this.props.rating) {
      case 1:
        return <img src={HalfStar} alt=".5/5" />;
      case 2:
        return <img src={OneStar} alt="1/5" />;
      case 3:
        return <img src={OneHalfStar} alt="1.5/5" />;
      case 4:
        return <img src={TwoStars} alt="2/5" />;
      case 5:
        return <img src={TwoHalfStars} alt="2.5/5" />;
      case 6:
        return <img src={ThreeStars} alt="3/5" />;
      case 7:
        return <img src={ThreeHalfStars} alt="3.5/5" />;
      case 8:
        return <img src={FourStars} alt="4/5" />;
      case 9:
        return <img src={FourHalfStars} alt="4.5/5" />;
      case 10:
        return <img src={FiveStars} alt="5/5" />;
      default:
        return <img src={ZeroStars} alt="" />;
    }
  }
}
