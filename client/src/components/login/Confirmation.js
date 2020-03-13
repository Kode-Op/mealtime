import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

export default class LoginConfirmation extends Component {
  constructor(props) {
    super(props);
    const user = {
      email: this.props.location.state.email,
      password: this.props.location.state.password
    };
    this.state = { accountConfirmed: false, isLoaded: false, redirect: false };

  axios
    .post("/api/users/login", user)
    .then(res => {
      this.setState({ accountConfirmed: true, isLoaded: true });
    })
    .catch(error => {
      this.setState({ isLoaded: true });
    });
  }

  componentDidMount() {
    this.id = setTimeout(() => this.setState({ redirect: true }), 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.id);
  }

  render() {
    if (this.state.isLoaded) {
      if (this.state.accountConfirmed || this.state.redirect) {
        console.log("User Confirmed!")
        return <Redirect to="/" />;
      } else {
        return (
          <div>
            <br />
            <br />
            <p>
              Incorrect Password or email.
              Redirecting in 3 seconds....
            </p>
          </div>
        );
      }
    } else {
      return <div></div>;
    }
  }
}