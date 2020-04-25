//import libraries
import React, { Component } from "react";
import { Table } from "react-bootstrap";

//Import components
import UserOrderHistoryOverlay from "./UserOrderHistoryOverlay";

//import assests
import Loader from "../../assets/loader/Loader";

//Import utilities
import { GetOrdersByUserID } from "../../utils/axios/Orders";

//Import stylesheets
import "./UserOrderHistory.css";

export default class RestaurantOrderHistory extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      restaurants: [],
      areRestaurantsLoaded: false,
      restaurantSelectionMade: false,
      userOrders: [],
      areOrdersLoaded: false,
      cancelBox: "",
    };
  }

  componentDidMount() {
    this._isMounted = true;

    //Load the order data associated with the user that is logged in.
    GetOrdersByUserID(this.props.user._id)
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            userOrders: response.data.reverse(),
            areOrdersLoaded: true,
          });
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

  cancelOrder = (order, status) => {
    document.body.style.overflow = "hidden";
    if (status === "Pending") {
      this.setState({
        cancelBox: order._id,
      });
    }
  };

  cancelPopUp = () => {
    this.setState({
      cancelBox: "",
    });
  };

  componentWillUnmount() {
    document.body.style.overflow = "unset";
    this._isMounted = false;
  }

  renderOrders = () => {
    return this.state.userOrders.map((currentOrder, index) => {
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
    //Deconstruct the state
    const { areOrdersLoaded, userOrders, cancelBox } = this.state;

    if (areOrdersLoaded) {
      if (userOrders.length > 0) {
        return (
          <div>
            {cancelBox !== "" && (
              <UserOrderHistoryOverlay
                cancelPopUp={this.cancelPopUp}
                orderID={cancelBox}
              />
            )}
            <h2>Your Order History</h2>
            <Table>
              <thead>
                <tr>
                  <th>Status</th>
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
