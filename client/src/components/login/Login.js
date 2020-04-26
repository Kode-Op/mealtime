//Import libraries
import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";

//Import stylesheets
import "./Login.css";

export default class Login extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      isValidated: false,
    };

    //If this page was redirected back from the confirmation page,
    //set errorMessage to the errorMessage from the confirmation page.
    if (typeof this.props.location.state !== "undefined") {
      this.state = { errorMessage: this.props.location.state.errorMessage };
    }
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //Event handlers for each form field
  onChangeEmail = (e) => {
    if (this._isMounted) {
      this.setState({
        email: e.target.value,
      });
    }
  };
  onChangePassword = (e) => {
    if (this._isMounted) {
      this.setState({
        password: e.target.value,
      });
    }
  };

  //Event handler for form submission
  onSubmit = (e) => {
    e.preventDefault();

    if (this.validate()) {
      if (this._isMounted) {
        this.setState({ isValidated: true });
      }
    }
  };

  //Helper function that verifies if the email is in the format email@website.domain
  validate = () => {
    //Regular expression courtesy of https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const emailVerification = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailVerification.test(this.state.email) && this._isMounted) {
      this.setState({ errorMessage: "You must enter a valid email address." });
      return false;
    }
    return true;
  };

  render() {
    if (this.state.isValidated) {
      return (
        <Redirect
          to={{
            pathname: "/login/confirmation",
            state: {
              email: this.state.email,
              password: this.state.password,
            },
          }}
        />
      );
    } else {
      return (
        <div className="loginMainContainer">
          <div className="loginContainer">
            <h2 className="loginHeader">Welcome back</h2>
            <form onSubmit={this.onSubmit}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                className="inputBox"
                value={this.state.email}
                onChange={this.onChangeEmail}
                required
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                className="inputBox"
                value={this.state.password}
                onChange={this.onChangePassword}
                required
              />
              <Button
                variant="success"
                className="loginButton"
                type="submit"
                block
              >
                Login
              </Button>
            </form>
            <div className="loginErrorMessage">{this.state.errorMessage}</div>
            New to MealTime?
            <Link to="/register" className="registerLink">
              Sign up!
            </Link>
          </div>
        </div>
      );
    }
  }
}
