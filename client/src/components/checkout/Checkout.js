//Import libraries
import React, { Component } from "react";

//Import components
import Navbar from "../nav/Navbar";

//Import utilities
import GetLogin from "../../utils/GetLogin";

export default class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLoaded: false,
      user: [],
    };
  }

  componentDidMount() {
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
  render() {
    return (
      <div>
        <Navbar />
        <div>Hello, world!</div>
      </div>
    );
  }
}
