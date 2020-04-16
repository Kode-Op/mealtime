//import libraries
import React, { Component } from "react";
//import { Table } from "react-bootstrap";
import axios from "axios";
import _ from "lodash";

//import components
//import Navbar from "../nav/Navbar";

//import utilities
//import GetLogin from "../../utils/GetLogin";

//import assests
import Loader from "../../assets/loader/Loader";

export default class RestaurantOrderHistory extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      user: [],
      isUserLoaded: false,
      restaurants: [],
      areRestaurantsLoaded: false,
      restaurantSelectionMade: false,
      menuItems: [],
      areMenuItemsLoaded: false,
      restaurantID: "",
      additionalCategories: [],

      //Default menu item values
      name: "",
      price: "$0.00",
      preptime: 0,
      description: "",
      category: "",
      errorMessage: "",
      successMessage: "",
    };
  }

  componentDidMount() {
    this._isMounted = true;

    //Load the restaurant data associated with the user that is logged in.
    axios
      .get("/api/restaurants/byOwner/" + this.props.user._id)
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            restaurants: response.data,
            areRestaurantsLoaded: true,
          });
          console.table(response.data);
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            areRestaurantsLoaded: true,
          });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  renderMenuItems = () => {
    return this.state.menuitems.map((currentMenuItem, index) => {
      return (
        <tr key={index}>
          <td>{currentMenuItem.name}</td>
          <td>{currentMenuItem.price}</td>
          <td>{currentMenuItem.quantity}</td>
        </tr>
      );
    });
  };

  getRestaurantSelection = () => {
    return this.state.restaurants.map((currentRestaurant) => {
      return (
        <option key={currentRestaurant._id} value={currentRestaurant._id}>
          {currentRestaurant.name + " - " + currentRestaurant.address}
        </option>
      );
    });
  };

  getRestaurantMenuItems = (e) => {
    if (e.target.value !== "0") {
      let restaurantID = e.target.value;
      this.setState({
        restaurantSelectionMade: true,
        additionalCategories: [],
      });
      axios
        .get("/api/menuitems/" + e.target.value)
        .then((response) => {
          const groupedByCategory = _.groupBy(
            response.data,
            (menuitem) => menuitem.category
          );
          this.setState({
            restaurantID: restaurantID,
            menuItems: groupedByCategory,
            areMenuItemsLoaded: true,
          });
        })
        .catch((error) => {
          this.setState({
            menuItems: null,
            areMenuItemsLoaded: true,
          });
          console.log(error);
        });
    } else {
      this.setState({
        restaurantSelectionMade: false,
        areMenuItemsLoaded: false,
      });
    }
  };

  render() {
    if (this.state.areRestaurantsLoaded) {
      if (this.state.restaurants.length > 0) {
        return (
          <div>
            <h2>Please select a restaurant</h2>
            <div style={{ display: "flex" }}>
              <select
                id="0"
                onChange={this.getRestaurantMenuItems}
                className="ManageRestaurantInputBox"
                style={{ marginBottom: -20 }}
              >
                <option value="0"></option>
                { this.getRestaurantSelection() }
              </select>
            </div>
          </div>
        );
      } else {
        return (
          <div style={{ marginTop: 10 }}>
            <h2>It looks like you don't have any restaurants yet!</h2>
            <p>Click "Manage Restaurants" to add a restaurant first.</p>
          </div>
        );
      }
    } else {
      return <Loader />;
    }
  }
}
