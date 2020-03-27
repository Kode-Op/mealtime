import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { setInStorage } from "../../utils/storage";

import Loader from "../../assets/loader/Loader";

export default class LoginConfirmation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountConfirmed: false,
      token: "",
      isLoaded: false,
      redirect: false,
      undefinedVars: false
    };

    if (typeof this.props.location.state !== "undefined") {
      let user = {
        email: this.props.location.state.email,
        password: this.props.location.state.password
      };

      axios
        .post("/api/users/login", user)
        .then(response => {
          // login successful, token created and saved
          setInStorage("mealtime", { token: response.data.token });
          this.setState({
            isLoaded: true,
            accountConfirmed: true,
            undefinedVars: false
          });
        })
        .catch(() => {
          this.setState({
            // login failed
            isLoaded: true,
            accountConfirmed: false,
            undefinedVars: false
          });
        });
    } else {
      this.setState({
        isLoaded: true,
        undefinedVars: true,
        accountConfirmed: false
      });
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
      if (this.state.undefinedVars) {
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: {
                errorMessage: "An unexpected error has occurred. \n"
              }
            }}
          />
        );
      } else if (this.state.accountConfirmed) {
        return (
          <Redirect
            to={{
              pathname: "/"
            }}
          />
        );
      } else {
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: {
                errorMessage: "Invalid email or password. \n"
              }
            }}
          />
        );
      }
    } else if (!this.state.isLoaded) {
      if (this.state.redirect) {
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: {
                errorMessage: "An unexpected error has occurred. \n"
              }
            }}
          />
        );
      } else {
        return (
          <div style={{ height: 140 }}>
            <Loader />
          </div>
        );
      }
    }
  }
}
