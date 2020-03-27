import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { getFromStorage } from "../../utils/storage";
import Loader from "../../assets/loader/Loader";

export default class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoaded: false };
  }

  componentDidMount() {
    const obj = getFromStorage("mealtime");
    let token = "";
    if (obj !== null) {
      token = obj.token;
      axios
        .get("/api/users/logout/" + token)
        .then(response => {
          this.setState({ isLoaded: true });
        })
        .catch(error => {
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
