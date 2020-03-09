import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

export default class Confirmation extends Component {
  constructor(props) {
    super(props);
    const user = {
      firstName: this.props.location.state.firstName,
      lastName: this.props.location.state.lastName,
      email: this.props.location.state.email,
      password: this.props.location.state.password
    };
    this.state = { accountCreated: false, isLoaded: false, redirect: false };

    axios
      .post("/api/users/add", user)
      .then(res => {
        this.setState({ accountCreated: true, isLoaded: true });
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
      if (this.state.accountCreated || this.state.redirect) {
        return <Redirect to="/" />;
      } else {
        return (
          <div>
            <br />
            <br />
            <p>
              An unexpected error has occured during your account creation.
              Redirecting in 3 seconds...
            </p>
          </div>
        );
      }
    } else {
      return <div></div>;
    }
  }
}
