//import libraries
import React, { Component } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
// import _ from "lodash";

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
      restaurantOrders: [],
      areOrdersLoaded: false,

      //Default menu item values
      name: "",
      price: "$0.00",
      preptime: 0,
      createdAt: "",
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

  getRestaurantSelection = () => {
    return this.state.restaurants.map((currentRestaurant) => {
      return (
        <option key={currentRestaurant._id} value={currentRestaurant._id}>
          {currentRestaurant.name + " - " + currentRestaurant.address}
        </option>
      );
    });
  };

  getRestaurantOrders = (e) => {
    if (e.target.value !== "0") {
      let restaurantID = e.target.value;
      this.setState({
        restaurantSelectionMade: true,
        additionalCategories: [],
      });
      axios
        .get("/api/orders/byRestaurant/" + e.target.value)
        .then((response) => {
          this.setState({
            restaurantID: restaurantID,
            restaurantOrders: response.data,
            areOrdersLoaded: true,
          });
          console.table(response.data);
        })
        .catch((error) => {
          this.setState({
            restaurantOrders: null,
            areMOrdersLoaded: true,
          });
          console.log(error);
        });
    } else {
      this.setState({
        restaurantSelectionMade: false,
        areOrdersLoaded: false,
      });
    }
  };

  renderOrders = () => {
    return this.state.restaurantOrders.map((currentOrder, index) => {
      return (
        <tr key={index}>
          <td>{this.getMenuItemNames(currentOrder.menuItems)}</td>
          <td>{this.getMenuItemPrices(currentOrder.menuItems)}</td>
          <td>{currentOrder.createdAt}</td>
        </tr>
      );
    });
  };

  getMenuItemNames = (menuItems) => {
    return menuItems.map((currentItem) => {
      return <div>{currentItem.name}</div>;
    });
  };

  getMenuItemPrices = (menuItems) => {
    return menuItems.map((currentItem) => {
      return <div>{currentItem.price / 100}</div>;
    });
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
                onChange={this.getRestaurantOrders}
                className="ManageRestaurantInputBox"
                style={{ marginBottom: -20 }}
              >
                <option value="0"></option>
                {this.getRestaurantSelection()}
              </select>
            </div>
            <div style={{ height: 50 }} />
            <h2>Your Order History</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Time Order Created</th>
                </tr>
              </thead>
              <tbody>{this.renderOrders()}</tbody>
            </Table>
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
