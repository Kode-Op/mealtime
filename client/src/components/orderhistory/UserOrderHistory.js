//import libraries
import React, { Component } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";

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
      userOrders: [],
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

    //Load the order data associated with the user that is logged in.
    axios
      .get("/api/orders/byUser/" + this.props.user._id)
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            userOrders: response.data,
            areOrdersLoaded: true,
          });
          console.table(response.data);
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            areOrdersLoaded: true,
          });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  renderOrders = () => {
    return this.state.userOrders.reverse().map((currentOrder, index) => {
      return (
        <tr key={index}>
          <td>{this.getMenuItemNames(currentOrder.menuItems)}</td>
          <td>{this.getMenuItemPrices(currentOrder.menuItems)}</td>
          <td>{this.getMenuItemQuantities(currentOrder.quantity)}</td>
          <td>${currentOrder.totalPaid / 100}</td>
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
      return <div>${currentItem.price / 100}</div>;
    });
  };

  getMenuItemQuantities = (quantity) => {
    return quantity.map((currentQuantity) => {
      return <div> x{currentQuantity}</div>;
    });
  };

  render() {
    if (this.state.areOrdersLoaded) {
      if (this.state.userOrders.length > 0) {
        return (
          <div>
            <div style={{ height: 50 }} />
            <h2>Your Order History</h2>
            <Table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Order Total</th>
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
            <h2>It looks like you don't have any orders yet!</h2>
            <p>
              Enter your location in our search bar and order from any one of
              Mealtime's great restaurants.
            </p>
          </div>
        );
      }
    } else {
      return <Loader />;
    }
  }
}
