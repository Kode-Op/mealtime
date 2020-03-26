//Import libraries
import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import { Redirect } from "react-router-dom";

//Import assets
import RestaurantImagePlaceholder from "./restaurantimageplaceholder.png";
import ZeroStars from "../../assets/images/restaurantratings/zerostars.png";
import OneStar from "../../assets/images/restaurantratings/onestar.png";
import TwoStars from "../../assets/images/restaurantratings/twostars.png";
import ThreeStars from "../../assets/images/restaurantratings/threestars.png";
import FourStars from "../../assets/images/restaurantratings/fourstars.png";
import FiveStars from "../../assets/images/restaurantratings/fivestars.png";
import ZeroDollars from "../../assets/images/restaurantprices/zerodollars.png";
import OneDollar from "../../assets/images/restaurantprices/onedollar.png";
import TwoDollars from "../../assets/images/restaurantprices/twodollars.png";
import ThreeDollars from "../../assets/images/restaurantprices/threedollars.png";
import FourDollars from "../../assets/images/restaurantprices/fourdollars.png";
import FiveDollars from "../../assets/images/restaurantprices/fivedollars.png";

//Import stylesheet
import "./restaurantview-component.css";

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

export default class RestaurantViewComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: false };
        this.viewRestaurant = this.viewRestaurant.bind(this);
    }

    viewRestaurant = () => {
        this.setState({ redirect: true });
    };

    render() {
        if (!this.state.redirect) {
            return (
                <ListGroup.Item
                    className="RestaurantViewComponentItem"
                    onClick={this.viewRestaurant}
                >
                    <img
                        src={RestaurantImagePlaceholder}
                        className="RestaurantViewComponentImage"
                        alt=""
                    />
                    <div className="RestaurantViewComponentName">
                        {this.props.restaurant.name}
                    </div>
                    <div className="RestaurantViewComponentRating">
                        <DisplayRating rating={this.props.restaurant.rating} />
                    </div>
                    <div className="RestaurantViewComponentNumReviews">
                        {this.props.restaurant.review.length} reviews
          </div>
                    <div className="RestaurantViewComponentPrice">
                        <DisplayPrice price={this.props.restaurant.price} />
                    </div>
                    <div className="RestaurantViewComponentDistance">xx.xx miles</div>
                </ListGroup.Item>
            );
        } else {
            return <Redirect to={"/restaurant?id=" + this.props.restaurant._id} />;
        }
    }
}
