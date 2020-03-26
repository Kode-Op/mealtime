import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { getFromStorage } from "../utils/storage";

export default class Session extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      token: "",
      signUpError: "",
      signInError: ""
    };
  }

  componentDidMount() {
    const obj = getFromStorage("mealtime");
    const token = obj.token;
    if (obj && token) {
      // Verify token
      axios.get("/api/users/verify/" + token).then(response => {
        console.log(response);
        if (response.data.success) {
          console.log("success");
          this.setState({
            token: token,
            isLoading: false
          });
        } else {
          console.log("Error:" + response.data.message);
          this.setState({
            isLoading: false
          });
        }
      });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  render() {
    const { isLoading, token } = this.state;

    if (isLoading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }
    if (!token) {
      return (
        <div>
          <Link to="/register" className="registerLink">
            Sign up
          </Link>
          <Link to="/login" className="loginLink">
            Sign in
          </Link>
        </div>
      );
    }
    return (
      <div>
        <Link to="/account" className="registerLink">
          Account
        </Link>
        <Link to="/logout" className="logoutLink">
          Sign Out
        </Link>
      </div>
    );
  }
}
