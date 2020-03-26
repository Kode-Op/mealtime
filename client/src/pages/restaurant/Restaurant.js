import React, { Component } from "react";
import Navbar from "../../components/nav/Navbar";
// import RestaurantViewComponent from "../../components/restaurant/restaurantview - component";
import RestaurantListComponent from "../../components/search/restaurantlist-component";
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
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../../assets/loader/Loader";
import "./Restaurant.css";

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

export default class Restaurant extends Component {
  constructor(props) {
    super(props);
    this.state = { isValidRestaurant: false, isLoaded: false };
  }

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const id = query.get("id");

    console.log(id);

    axios
      .get("/api/restaurants/" + id)
      .then(response => {
        this.setState({
          restaurant: response.data,
          isValidRestaurant: true,
          isLoaded: true
        });
      })
      .catch(error => {
        this.setState({ isValidRestaurant: false, isLoaded: true });
      });
  }

  restaurantView() {
    return this.state.restaurants.map(currentRestaurant => {
      return (
        <RestaurantListComponent
          restaurant={currentRestaurant}
          key={currentRestaurant._id}
        />
      );
    });
  }

  render() {
    if (this.state.isLoaded) {
      if (this.state.isValidRestaurant) {
        return (
          <div>
            <Navbar />
            <div className="RestaurantContainer">
              <div className="RestaurantTitleContainer">
                <img
                  src={RestaurantImagePlaceholder}
                  alt=""
                  className="RestaurantImage"
                />
                <h2 className="RestaurantName">{this.state.restaurant.name}</h2>
              </div>
              <hr />
              <div className="RestaurantFlexContainer">
                <div className="RestaurantRating">
                  <DisplayRating rating={this.state.restaurant.rating} />
                </div>
                <div className="RestaurantPrice">
                  <DisplayPrice price={this.state.restaurant.price} />
                </div>
                <div className="RestaurantDistance">xx.xx miles</div>
              </div>
              <hr />
              <div className="RestaurantFilters">
                <h4>All Items</h4>
              </div>
              <div className="RestaurantMenuCollection">
                <div className="RestaurantMenuItem">I am a menu item</div>
                <div className="RestaurantMenuItem">I am a menu item</div>
                <div className="RestaurantMenuItem">I am a menu item</div>
                <div className="RestaurantMenuItem">I am a menu item</div>
                <div className="RestaurantMenuItem">I am a menu item</div>
                <div className="RestaurantMenuItem">I am a menu item</div>
                <div className="RestaurantMenuItem">I am a menu item</div>
                <div className="RestaurantMenuItem">I am a menu item</div>
                <div className="RestaurantMenuItem">I am a menu item</div>
                <div className="RestaurantMenuItem">I am a menu item</div>
                <div className="RestaurantMenuItem">I am a menu item</div>
                <div className="RestaurantMenuItem">I am a menu item</div>
                <div className="RestaurantMenuItem">I am a menu item</div>
                <div className="RestaurantMenuItem">I am a menu item</div>
                <div className="RestaurantMenuItem">I am a menu item</div>
              </div>
            </div>
            <div style={{ height: 1200 }} />
          </div>
        );
      } else {
        return (
          <div>
            <Navbar />
            <br />
            <br />
            <h3>Oops</h3>
            <br />
            <p>
              We weren't able to find the restaurant you are looking for. Sorry
              about that!
            </p>
            <p>
              Click <Link to="/search">here</Link> to return to your search.
            </p>
          </div>
        );
      }
    } else {
      return (
        <div>
          <Navbar />
          <div style={{ height: 60 }} />
          <Loader />
        </div>
      );
    }
  }
}
