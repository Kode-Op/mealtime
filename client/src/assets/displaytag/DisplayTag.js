import React, { Component } from "react";
import American from "../../assets/images/tags/0.jpg";
import Asian from "../../assets/images/tags/1.jpg";
import Bakery from "../../assets/images/tags/2.jpg";
import BBQ from "../../assets/images/tags/3.jpg";
import Breakfast from "../../assets/images/tags/4.jpg";
import Brunch from "../../assets/images/tags/5.jpg";
import Burgers from "../../assets/images/tags/6.jpg";
import Cajun from "../../assets/images/tags/7.jpg";
import Chicken from "../../assets/images/tags/8.jpg";
import Chinese from "../../assets/images/tags/9.jpg";
import Dessert from "../../assets/images/tags/10.jpg";
import Dinner from "../../assets/images/tags/11.jpg";
import Fastfood from "../../assets/images/tags/12.jpg";
import Greek from "../../assets/images/tags/13.jpg";
import Healthy from "../../assets/images/tags/14.jpg";
import Indian from "../../assets/images/tags/15.jpg";
import Italian from "../../assets/images/tags/16.jpg";
import Japanese from "../../assets/images/tags/17.jpg";
import Korean from "../../assets/images/tags/18.jpg";
import Lunch from "../../assets/images/tags/19.jpg";
import Mexican from "../../assets/images/tags/20.jpg";
import Noodles from "../../assets/images/tags/21.jpg";
import Pasta from "../../assets/images/tags/22.jpg";
import Pizza from "../../assets/images/tags/23.jpg";
import Ramen from "../../assets/images/tags/24.jpg";
import Rich from "../../assets/images/tags/25.jpg";
import Salalds from "../../assets/images/tags/26.jpg";
import Salty from "../../assets/images/tags/27.jpg";
import Sandwiches from "../../assets/images/tags/28.jpg";
import Savory from "../../assets/images/tags/29.jpg";
import Seafood from "../../assets/images/tags/30.jpg";
import Singaporean from "../../assets/images/tags/31.jpg";
import Soups from "../../assets/images/tags/32.jpg";
import Southern from "../../assets/images/tags/33.jpg";
import Spicy from "../../assets/images/tags/34.jpg";
import Steak from "../../assets/images/tags/35.jpg";
import Sweet from "../../assets/images/tags/36.jpg";
import Tacos from "../../assets/images/tags/37.jpg";
import Thai from "../../assets/images/tags/38.jpg";
import Vegan from "../../assets/images/tags/39.jpg";
import Vegetarian from "../../assets/images/tags/40.jpg";
import Vietnamese from "../../assets/images/tags/41.jpg";
import Placeholder from "../../assets/images/tags/41.jpg";

export default class DisplayTag extends Component {
  render() {
    if (this.props.size === "small") {
      switch (this.props.tag) {
        case 0:
          return <img src={American} alt="0" />;
        case 1:
          return <img src={Asian} alt="1" />;
        case 2:
          return <img src={Bakery} alt="2" />;
        case 3:
          return <img src={BBQ} alt="3" />;
        case 4:
          return <img src={Breakfast} alt="4" />;
        case 5:
          return <img src={Brunch} alt="5" />;
        case 6:
          return <img src={Burgers} alt="6" />;
        case 7:
          return <img src={Cajun} alt="7" />;
        case 8:
          return <img src={Chicken} alt="8" />;
        case 9:
          return <img src={Chinese} alt="9" />;
        case 10:
          return <img src={Dessert} alt="10" />;
        case 11:
          return <img src={Dinner} alt="11" />;
        case 12:
          return <img src={Fastfood} alt="12" />;
        case 13:
          return <img src={Greek} alt="13" />;
        case 14:
          return <img src={Healthy} alt="14" />;
        case 15:
          return <img src={Indian} alt="15" />;
        case 16:
          return <img src={Italian} alt="16" />;
        case 17:
          return <img src={Japanese} alt="17" />;
        case 18:
          return <img src={Korean} alt="18" />;
        case 19:
          return <img src={Lunch} alt="19" />;
        case 20:
          return <img src={Mexican} alt="20" />;
        case 21:
          return <img src={Noodles} alt="21" />;
        case 22:
          return <img src={Pasta} alt="22" />;
        case 23:
          return <img src={Pizza} alt="23" />;
        case 24:
          return <img src={Ramen} alt="24" />;
        case 25:
          return <img src={Rich} alt="25" />;
        case 26:
          return <img src={Salalds} alt="26" />;
        case 27:
          return <img src={Salty} alt="27" />;
        case 28:
          return <img src={Sandwiches} alt="28" />;
        case 29:
          return <img src={Savory} alt="29" />;
        case 30:
          return <img src={Seafood} alt="30" />;
        case 31:
          return <img src={Singaporean} alt="31" />;
        case 32:
          return <img src={Soups} alt="32" />;
        case 33:
          return <img src={Southern} alt="33" />;
        case 34:
          return <img src={Spicy} alt="34" />;
        case 35:
          return <img src={Steak} alt="35" />;
        case 36:
          return <img src={Sweet} alt="36" />;
        case 37:
          return <img src={Tacos} alt="37" />;
        case 38:
          return <img src={Thai} alt="38" />;
        case 39:
          return <img src={Vegan} alt="39" />;
        case 40:
          return <img src={Vegetarian} alt="40" />;
        case 41:
          return <img src={Vietnamese} alt="41" />;

        default:
          return <img src={Placeholder} alt="" />;
      }
    }
  }
}
