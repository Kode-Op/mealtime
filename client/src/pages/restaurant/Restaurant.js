import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import Navbar from "../../components/nav/Navbar";
// import RestaurantViewComponent from "../../components/restaurant/restaurantview - component";
import RestaurantListComponent from "../../components/search/restaurantlist-component";
import RestaurantImagePlaceholder from "./restaurantimageplaceholder.png";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../../assets/loader/Loader";
import "./Restaurant.css";

export default class Restaurant extends Component {
  constructor(props) {
    super(props);
    this.state = { isValidRestaurant: false, isLoaded: false };
  }

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const id = query.get("id");

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
          <div className="RestaurantViewContainer">
            <Navbar />
            <div className="RestaurantDescription">
              <img
                src={RestaurantImagePlaceholder}
                className="RestaurantViewComponentImage"
                alt=""
              />
              <h2 className="RestaurantName">{this.state.restaurant.name}</h2>
              <p className="RestaurantRating">Rating: {this.state.restaurant.rating} stars</p>
              <p className="RestaurantPrice">Price: {this.state.restaurant.price} dollar sign(s)</p>
              <p className="RestaurantDistance">xx.xx miles</p>
            </div>
            <div className="RestaurantFilters" width="545">
              <h4>All Items</h4>
            </div>
            <div className="RestaurantMenu">
              <ul className="Menu">
                <li>
                  <button>
                    Menu Item #1
                    <img
                      src={RestaurantImagePlaceholder}
                      className="RestaurantViewComponentImage"
                      alt=""
                    />
                    Price
                  </button>
                </li>
                <br></br>
                <li>
                  <button>
                    Menu Item #2
                    <img
                      src={RestaurantImagePlaceholder}
                      className="RestaurantViewComponentImage"
                      alt=""
                    />
                    Price
                  </button>
                </li>
                <br></br>
                <li>
                  <button>
                    Menu Item #3
                    <img
                      src={RestaurantImagePlaceholder}
                      className="RestaurantViewComponentImage"
                      alt=""
                    />
                    Price
                  </button>
                </li>
              </ul>
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
