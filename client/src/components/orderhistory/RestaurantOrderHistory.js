//import libraries
import React, { Component } from "react";
import { Table } from "react-bootstrap";

//Import components
import UserOrderHistoryOverlay from "./UserOrderHistoryOverlay";

//import assets
import Loader from "../../assets/loader/Loader";

//Import utilities
import { GetRestaurantByUserID } from "../../utils/axios/Restaurants";
import { GetOrdersByRestaurantID } from "../../utils/axios/Orders";

export default class RestaurantOrderHistory extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      restaurants: [],
      areRestaurantsLoaded: false,
      restaurantSelectionMade: false,
      restaurantID: "",
      restaurantOrders: [],
      areOrdersLoaded: false,
      cancelBox: "",
    };
  }

  componentDidMount() {
    this._isMounted = true;

    //Load the restaurant data associated with the user that is logged in.
    GetRestaurantByUserID(this.props.user._id)
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            restaurants: response.data,
            areRestaurantsLoaded: true,
          });
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

  cancelPopUp = () => {
    this.setState({
      cancelBox: "",
    });
  };

  cancelOrder = (order, status) => {
    document.body.style.overflow = "hidden";
    if (status === "Pending") {
      this.setState({
        cancelBox: order._id,
      });
    }
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

  getRestaurantOrders = (e) => {
    if (e.target.value !== "0") {
      let restaurantID = e.target.value;
      this.setState({
        restaurantSelectionMade: true,
        additionalCategories: [],
      });
      GetOrdersByRestaurantID(e.target.value)
        .then((response) => {
          this.setState({
            restaurantID: restaurantID,
            restaurantOrders: response.data.reverse(),
            areOrdersLoaded: true,
          });
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
      const date = new Date(currentOrder.createdAt).toString().substring(4, 15);
      const time = new Date(currentOrder.createdAt)
        .toString()
        .substring(16, 24);
      let status;
      let statusButtonColor;
      let statusCursor;
      if (currentOrder.isCanceled) {
        status = "Canceled";
        statusButtonColor = "#FF6633";
        statusCursor = "default";
      } else if (currentOrder.isFulfilled) {
        status = "Fulfilled";
        statusButtonColor = "#75B53C";
        statusCursor = "default";
      } else {
        status = "Pending";
        statusButtonColor = "#FFA000";
        statusCursor = "pointer";
      }
      return (
        <tr key={index}>
          <td>
            <div
              className="UserOrderHistoryButton"
              style={{
                backgroundColor: statusButtonColor,
                cursor: statusCursor,
              }}
              onClick={() => this.cancelOrder(currentOrder, status)}
            >
              {status}
            </div>
          </td>
          <td>
            {currentOrder.custFirst} {currentOrder.custLast}
          </td>
          <td>{this.getMenuItemNames(currentOrder.menuItems)}</td>
          <td>{this.getMenuItemPrices(currentOrder.menuItems)}</td>
          <td>{this.getMenuItemQuantities(currentOrder.quantity)}</td>
          <td>
            {(currentOrder.totalPaid / 100).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </td>
          <td>••••••••••••{currentOrder.lastFour}</td>
          <td>{date + ", " + time}</td>
        </tr>
      );
    });
  };

  getMenuItemNames = (menuItems) => {
    return menuItems.map((currentItem, index) => {
      return <div key={index}>{currentItem.name}</div>;
    });
  };

  getMenuItemPrices = (menuItems) => {
    return menuItems.map((currentItem, index) => {
      return (
        <div key={index}>
          {(currentItem.price / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </div>
      );
    });
  };

  getMenuItemQuantities = (quantity) => {
    return quantity.map((currentQuantity, index) => {
      return <div key={index}> x{currentQuantity}</div>;
    });
  };

  render() {
    const {
      areRestaurantsLoaded,
      restaurants,
      restaurantSelectionMade,
      cancelBox,
    } = this.state;

    if (areRestaurantsLoaded) {
      if (restaurants.length > 0) {
        return (
          <div>
            {cancelBox !== "" && (
              <UserOrderHistoryOverlay
                cancelPopUp={this.cancelPopUp}
                orderID={cancelBox}
              />
            )}
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
            {restaurantSelectionMade && (
              <div>
                <h2>Order History</h2>
                <Table>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Customer Name</th>
                      <th>Order</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Order Total</th>
                      <th>Credit Card</th>
                      <th>Time Order Created</th>
                    </tr>
                  </thead>
                  <tbody>{this.renderOrders()}</tbody>
                </Table>
              </div>
            )}
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
