import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { setInStorage } from "../../utils/storage";

import Loader from "../../assets/loader/Loader";

export default class RegisterConfirmation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountCreated: false,
      isLoaded: false,
      redirect: false,
      message: ""
    };

    if (typeof this.props.location.state !== "undefined") {
      let user = {
        firstName: this.props.location.state.firstName,
        lastName: this.props.location.state.lastName,
        email: this.props.location.state.email,
        password: this.props.location.state.password
      };
      axios
        .post("/api/users/add", user)
        .then()
        .catch(error => {
          this.setState({
            message: JSON.stringify(error.message)
          });
        })
        .then(() => {
          let userLogin = {
            email: this.props.location.state.email,
            password: this.props.location.state.password
          };
          axios.post("/api/users/login", userLogin).then(response => {
            if (response.data.success) {
              // login successful, token created and saved
              setInStorage("mealtime", { token: response.data.token });
              this.setState({ accountCreated: true });
            } else {
              this.setState({
                // login failed - should not be possible
                message: JSON.stringify(response.message)
              });
            }
          });
        })
        .then(() => {
          this.setState({
            isLoaded: true
          });
        });
    } else {
      this.state = {
        isLoaded: true,
        message: "An unexpected error has occured"
      };
    }
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
      } else if (
        this.state.message === '"Request failed with status code 403"'
      ) {
        return (
          <Redirect
            to={{
              pathname: "/register",
              state: {
                errorMessage: "An account with that email already exists. \n"
              }
            }}
          />
        );
      } else {
        return (
          <div>
            <br />
            <br />
            <p>{this.state.message}. Redirecting in 3 seconds...</p>
          </div>
        );
      }
    } else {
      return (
        <div style={{ height: 140 }}>
          <Loader />
        </div>
      );
    }
  }
}
