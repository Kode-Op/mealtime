//Import libraries
import React, { Component } from "react";

//Import components
import Navbar from "../nav/Navbar";
import Footer from "../footer/Footer";

//Import assets
import Loader from "../../assets/loader/Loader";

//Import utilities
import GetLogin from "../../utils/GetLogin";

//Import stylesheets
import "./Checkout.css";

export default class Checkout extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this._isMounted = true;

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

  render() {
    if (this.state.isUserLoaded) {
      if (this.state.user) {
        return (
          <div>
            <Navbar user={this.state.user} />
            <div className="CheckoutContainer">
              <div className="CheckoutBarMain">This goes on the left!</div>
              <div className="CheckoutBarRight">This goes on the right!</div>
            </div>
            <Footer />
          </div>
        );
      } else {
        //User is not logged in
        return (
          <div>
            <Navbar />
            TODO
          </div>
        );
      }
    } else {
      return <Loader />;
    }
  }
}
