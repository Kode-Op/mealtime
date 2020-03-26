import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { setInStorage } from "../../utils/storage";

export default class LoginConfirmation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountConfirmed: false,
      token: "",
      isLoaded: false,
      redirect: false,
      message: ""
    };

    if (typeof this.props.location.state !== "undefined") {
      let user = {
        email: this.props.location.state.email,
        password: this.props.location.state.password
      };

      axios.post("/api/users/login", user).then(response => {
        if (response.data.success) {
          // login successful, token created and saved
          setInStorage("mealtime", { token: response.data.token });
          this.setState({
            isLoaded: true,
            accountConfirmed: true
          });
        } else {
          this.setState({
            // login failed
            isLoaded: true,
            message: JSON.stringify(response.message)
          });
        }
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
      if (this.state.accountConfirmed) {
        return (
          <Redirect
            to={{
              pathname: "/",
              state: {
                email: this.state.email,
                token: this.state.token
              }
            }}
          />
        );
      } else if (this.state.redirect) {
        return <Redirect to="/" />;
      } else if (
        this.state.message === '"Request failed with status code 404"'
      ) {
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
      } else if (
        this.state.message === '"Request failed with status code 500"'
      ) {
        return (
          <div>
            <br />
            <br />
            <p>
              Error connecting to server. Please try again later. Redirecting in
              3 seconds...
            </p>
          </div>
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
      return <div></div>;
    }
  }
}
