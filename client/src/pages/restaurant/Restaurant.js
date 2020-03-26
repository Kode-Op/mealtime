//Import libraries
import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

//Import components
import Navbar from "../../components/nav/Navbar";
import MenuItemComponent from "../../components/restaurant/menuitem-component.js";

//Import assets
import DisplayPrice from "../../assets/displayprice/DisplayPrice";
import DisplayRating from "../../assets/displayrating/DisplayRating";
import RestaurantImagePlaceholder from "./restaurantimageplaceholder.png";
import Loader from "../../assets/loader/Loader";

//Import stylesheet
import "./Restaurant.css";

export default class Restaurant extends Component {
  constructor(props) {
    super(props);
    const query = new URLSearchParams(this.props.location.search);
    const id = query.get("id");

    this.state = {
      isValidRestaurant: false,
      isPageLoaded: false,
      areMenuItemsLoaded: false,
      id: id,
      menuItems: []
    };
  }

  componentDidMount() {
    //Get the restaurant data
    axios
      .get("/api/restaurants/" + this.state.id)
      .then(response => {
        this.setState({
          restaurant: response.data,
          isValidRestaurant: true,
          isPageLoaded: true
        });
      })
      .catch(error => {
        this.setState({ isValidRestaurant: false, isPageLoaded: true });
      });

    //Get the menu items
    axios
      .get("/api/menuitems/" + this.state.id)
      .then(response => {
        this.setState({ menuItems: response.data, areMenuItemsLoaded: true });
      })
      .catch(error => {
        this.setState({ areMenuItemsLoaded: true });
      });
  }

  getMenuItems() {
    if (this.state.areMenuItemsLoaded) {
      return this.state.menuItems.map(currentMenuItem => {
        return (
          <MenuItemComponent
            menuItem={currentMenuItem}
            key={currentMenuItem._id}
          />
        );
      });
    } else {
      return <Loader />;
    }
  }

  render() {
    if (this.state.isPageLoaded) {
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
            </div>
            <div className="RestaurantItemContainer">
              <div className="RestaurantContainer">
                <div className="RestaurantFilters">
                  <h4>All Items</h4>
                </div>
                <div className="RestaurantMenuCollection">
                  {this.getMenuItems()}
                </div>
              </div>
            </div>
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
