//import libraries
import React, { Component } from "react";
import { Table } from "react-bootstrap";
// import axios from "axios";

//import components
import Navbar from "../nav/Navbar";

//import utilities
import GetLogin from "../../utils/GetLogin";

//import assests
import Loader from "../../assets/loader/Loader";

export default class OrderHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: [],
      isUserLoaded: false,
      menuitems: [
        {
          name: "Double Double",
          price: 400,
          quantity: 1,
        },
        {
          name: "Fries",
          price: 200,
          quantity: 1,
        },
        {
          name: "Milkshake",
          price: 150,
          quantity: 1,
        },
      ],
    };
  }
  /*
        [{
            name:
            price:
            quantity:
        }]
    */

  /*
        [{
            orderid:
            restaurantname:
            menuitemname:
            price:
            quantity: 
        }]
    */

  componentDidMount() {
    GetLogin()
      .then((response) => {
        this.setState({
          user: response,
          isUserLoaded: true,
        });
      })

      .catch((error) => {
        this.setState({
          isUserLoaded: true,
        });
        console.log(error);
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
          <Navbar user={this.state.user} />
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
