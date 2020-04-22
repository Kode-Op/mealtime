//Import libraries
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
//import axios from "axios";

//Import assets
import Loader from "../../assets/loader/Loader";

//Import utilities
import { setInStorage } from "../../utils/storage";
import UserAdd from "../../utils/register/UserAdd";
import UserLogin from "../../utils/register/UserLogin";

export default class RegisterConfirmation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountCreated: false,
      isLoaded: false,
      redirect: false,
      message: ""
    };

    //this.props.location.state will only be undefined if this page
    //was accessed outside of the login page.
    if (typeof this.props.location.state !== "undefined") {
      let user = {
        firstName: this.props.location.state.firstName,
        lastName: this.props.location.state.lastName,
        email: this.props.location.state.email,
        password: this.props.location.state.password
      };
      UserAdd(user)
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
          UserLogin(userLogin).then(response => {
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

  //Set the page to redirect after three seconds if something goes wrong.
  componentDidMount() {
    this.id = setTimeout(() => this.setState({ redirect: true }), 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.id);
  }

  render() {
    if (this.state.isLoaded) {
      if (this.state.accountCreated || this.state.redirect) {
        return <Redirect to="/feed" />;
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
