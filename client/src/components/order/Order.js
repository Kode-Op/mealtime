//Import libraries
import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

//Import components
import Navbar from "../nav/Navbar";
import Footer from "../footer/Footer";

//Import assets
import FoodImg from "../../assets/images/orders/food.png";
import Loader from "../../assets/loader/Loader";

//Import utilities
import GetLogin from "../../utils/GetLogin";
import { GetOrderByID } from "../../utils/axios/Orders";

//Import stylesheets
import "./Order.css";

export default class Order extends Component {
  _isMounted = false;

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
      readyTime: "",
    };
  }

  componentDidMount() {
    this._isMounted = true;

    //Bind 'this' to loadOrder()
    this.loadOrder = this.loadOrder.bind(this);

    if (this.state.id !== "") {
      this.loadOrder();
      setInterval(this.loadOrder, 30000);
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

  componentWillUnmount() {
    this._isMounted = false;
  }

  //This functions gets the order data. Set on a 30 second timer
  async loadOrder() {
    return GetOrderByID(this.state.id)
      .then((response) => {
        //Convert createdAt from an ISO Date format to the JavaScript standard string format
        let readyTime = new Date(response.data[0].createdAt);

        //Add the prepTime to the createdAt date to get readyTime
        readyTime.setMinutes(
          readyTime.getMinutes() + response.data[0].prepTime
        );

        if (this._isMounted) {
          this.setState({
            order: response.data[0],
            isOrderLoaded: true,
            readyTime: readyTime,
          });
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            order: null,
            isOrderLoaded: true,
          });
        }
      });
  }

  getOrderStatus = (order, readyTime) => {
    const { isCancelled, isFulfilled } = order;

    const currentTime = new Date();
    const timeDifference = readyTime - currentTime;
    let minutesRemaining;

    if (timeDifference > 0) {
      minutesRemaining = new Date(timeDifference).getMinutes();
    } else {
      minutesRemaining = 0;
    }

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
          <h3>Your order has been fulfilled. Enjoy!</h3>
          <br />
        </div>
      );
    } else {
      if (minutesRemaining > 0) {
        return (
          <div>
            <h3>Your order is being processed!</h3>
            <p>
              Estimated time remaining:{" "}
              <span style={{ color: "green" }}>
                About {minutesRemaining} minute
                {minutesRemaining !== 1 ? "s" : ""}
              </span>
            </p>
          </div>
        );
      } else {
        return (
          <div>
            <h3>Your order is being processed!</h3>
            <p>
              Estimated time remaining:{" "}
              <span style={{ color: "green" }}>Any minute now</span>
            </p>
          </div>
        );
      }
    }
  };

  render() {
    const { isUserLoaded, user, isOrderLoaded, order, readyTime } = this.state;

    if (isUserLoaded && isOrderLoaded) {
      if (!user) {
        return <Redirect to="/" />;
      }
      if (order) {
        return (
          <div>
            <Navbar user={user} />
            <div className="OrderCenterDiv">
              {this.getOrderStatus(order, readyTime)}
              <img src={FoodImg} alt="" />
              <br />
              <br />
              <div>Delivering to: {order.custAddress} </div>
            </div>
            <Footer />
          </div>
        );
      } else {
        return (
          <div>
            <Navbar user={user} />
            <br />
            <br />
            <h3>Oops</h3>
            <br />
            <p>
              We weren't able to find the order you are looking for. Sorry about
              that!
            </p>
            <p>
              Click <Link to="/">here</Link> to return home.
            </p>
          </div>
        );
      }
    } else {
      return <Loader />;
    }
  }
}
