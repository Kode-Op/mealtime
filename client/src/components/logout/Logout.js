//Import libraries
import React, { Component } from "react";
//import axios from "axios";
import { Redirect } from "react-router-dom";

//Import assets
import Loader from "../../assets/loader/Loader";

//Import utilities
import { getFromStorage } from "../../utils/storage";
import { DeleteUserToken } from "../../utils/axios/Users";

export default class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoaded: false };
  }

  //If the user isn't already logged out, call /api/users/logout/_token
  //and set isLoaded to true when a response is returned
  componentDidMount() {
    const obj = getFromStorage("mealtime");
    let token = "";
    if (obj !== null) {
      token = obj.token;
      DeleteUserToken(token)
        .then(() => {
          this.setState({ isLoaded: true });
        })
        .catch(() => {
          this.setState({ isLoaded: true });
        });
    } else {
      this.setState({ isLoaded: true });
    }
  }
  render() {
    if (this.state.isLoaded) {
      return <Redirect to="/" />;
    } else {
      return <Loader />;
    }
  }
}
