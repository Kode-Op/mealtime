//import libraries
import React, { Component } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";

//import components
//import Navbar from "../nav/Navbar";

//import utilities
//import GetLogin from "../../utils/GetLogin";

//import assests
import Loader from "../../assets/loader/Loader";

export default class UserOrderHistory extends Component {
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
      //   menuitems: [
      //     {
      //       name: "Tuna Sub",
      //       price: 600,
      //       quantity: 1,
      //     },
      //     {
      //       name: "Meatball Marinara Sub",
      //       price: 500,
      //       quantity: 1,
      //     },
      //     {
      //       name: "Chocolate Chip Cookie",
      //       price: 150,
      //       quantity: 1,
      //     },
      //   ],
    };
  }

  componentDidMount() {
    this._isMounted = true;

    //Load the restaurant data associated with the user that is logged in.
    axios
      .get("/api/orders/byUser/" + this.props.user._id)
      .then((response) => {
        if (this._isMounted) {
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

  render() {
    if (this.state.isUserLoaded) {
      return (
        <div>
          {/* <Navbar user={this.state.user} /> */}
          {/* <div style={{ height: 10 }} /> */}

          <h2>Your Order History</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>{this.renderMenuItems()}</tbody>
          </Table>
        </div>
      );
    } else {
      return <Loader />;
    }
  }
}
