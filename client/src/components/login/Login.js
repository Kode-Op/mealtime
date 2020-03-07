import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Login.css";

const initialState = {
  email: "",
  password: "",
  errorMessage: ""
};

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  validate = () => {
    //Regular expression courtesy of https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const emailVerification = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let errorMessage = "";

    if (!emailVerification.test(this.state.email)) {
      errorMessage = "You must enter a valid email address.";
    }

    if (errorMessage) {
      this.setState({ errorMessage });
      return false;
    }
    return true;
  };

  onSubmit(e) {
    e.preventDefault();

    const isValid = this.validate();
    const user = {
      email: this.state.email,
      password: this.state.password
    };

    if (isValid) {
      console.log(user);
      //Clear form
      this.setState(initialState);
    }

    //window.location = "/"; // Go to the home page on submit
  }

  render() {
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
