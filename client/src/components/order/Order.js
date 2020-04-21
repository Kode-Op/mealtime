//Import libraries
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

//Import components
import Navbar from "../nav/Navbar";
// import Footer from "../footer/Footer";

//Import assets
import FoodImg from "../../assets/images/orders/food.png";
import Loader from "../../assets/loader/Loader";

//Import utilities
import GetLogin from "../../utils/GetLogin";

//Import stylesheets
import "./Order.css";

export default class Order extends Component {
  _isMounted = true;

  constructor(props) {
    super(props);

    //Search the URL for an ID, then store it as a state variable
    const query = new URLSearchParams(this.props.location.search);
    const id = query.get("id");

    this.state = {
      id: id,
      order: [],
      user: [],
      isOrderLoaded: false,
      isUserLoaded: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    if (this.state.id !== "") {
      axios
        .get("/api/orders/" + this.state.id)
        .then((response) => {
          this.setState({
            order: response.data,
            isOrderLoaded: true,
          });
          let date = new Date(response.data.createdAt);
          console.log(
            date.getMinutes(
              date.setMinutes(date.getMinutes() + response.data.prepTime)
            )
          );
          //date.setMinutes(date.getMinutes() + response.data.preptime);
          //let isoDate = date.toISOString();
          console.log(date);
          //console.log(isoDate);
        })
        .catch(() => {
          this.setState({
            order: null,
            isOrderLoaded: true,
          });
        });
    } else {
      this.setState({
        order: null,
        isOrderLoaded: true,
      });
    }

    //Get "user" and "isUserLoaded" from the GetLogin utility
    GetLogin()
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            isUserLoaded: true,
            user: response,
          });
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            isUserLoaded: true,
          });
        }
      });
  }

  getOrderStatus = (order) => {
    const { isCancelled, isFulfilled } = order;
    if (isCancelled) {
      return (
        <div>
          <h3>Your order is cancelled</h3>
          <br />
        </div>
      );
    } else if (isFulfilled) {
      return (
        <div>
          <h3>Your order has been fulfilled!</h3>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          <h3>Your order is being processed!</h3>
          <p>
            Estimated time remaining:{" "}
            <span style={{ color: "green" }}>4 minutes</span>
          </p>
        </div>
      );
    }
  };
  render() {
    //Deconstruct the state
    const { isUserLoaded, user, isOrderLoaded, order } = this.state;

    if (isUserLoaded && isOrderLoaded) {
      if (!user) {
        return <Redirect to="/" />;
      }
      if (order) {
        return (
          <div>
            <Navbar user={user} />
            <div className="OrderCenterDiv">
              {this.getOrderStatus(order)}
              <img src={FoodImg} alt="" />
              <div>Delivering to: {order.custAddress} </div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <Navbar user={user} />
            Invalid order
          </div>
        );
      }
    } else {
      return <Loader />;
    }
  }
}
