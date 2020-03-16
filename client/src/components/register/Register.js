import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import "./Register.css";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  errorMessage: "",
  isValidated: false
};

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = initialState;

    if (typeof this.props.location.state !== "undefined") {
      this.state = { errorMessage: this.props.location.state.errorMessage };
    }
  }

  onChangeFirstName(e) {
    this.setState({
      firstName: e.target.value
    });
  }

  onChangeLastName(e) {
    this.setState({
      lastName: e.target.value
    });
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
    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;

    //Regular expression courtesy of https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const emailVerification = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let errorMessage = "";

    if (!emailVerification.test(this.state.email)) {
      errorMessage = "You must enter a valid email address. \n";
    }

    if (this.state.password.length < 8) {
      errorMessage = errorMessage.concat(
        "Your password must contain at least 8 characters. \n"
      );
    }

    if (!lowerCaseLetters.test(this.state.password)) {
      errorMessage = errorMessage.concat(
        "Your password must contain lowercase letters. \n"
      );
    }

    if (!upperCaseLetters.test(this.state.password)) {
      errorMessage = errorMessage.concat(
        "Your password must contain uppercase letters. \n"
      );
    }

    if (!numbers.test(this.state.password)) {
      errorMessage = errorMessage.concat(
        "Your password must contain numbers. \n"
      );
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

    if (isValid) {
      this.setState({ isValidated: true });
    }
  }

  render() {
    if (this.state.isValidated) {
      return (
        <Redirect
          to={{
            pathname: "/register/confirmation",
            state: {
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              email: this.state.email,
              password: this.state.password
            }
          }}
        />
      );
    } else {
      return (
        <div className="registerMainContainer">
          <div className="registerContainer">
            <form onSubmit={this.onSubmit}>
              <h2 className="registerHeader">Create your account</h2>
              <div className="registerDivSplitLeft">
                <label htmlFor="fName">First name</label>
                <input
                  type="text"
                  name="fName"
                  className="inputBox"
                  value={this.state.firstName}
                  onChange={this.onChangeFirstName}
                  required
                />
              </div>
              <div className="registerDivSplitRight">
                <label htmlFor="lName">Last name</label>
                <input
                  type="text"
                  name="lName"
                  className="inputBox"
                  value={this.state.lastName}
                  onChange={this.onChangeLastName}
                  required
                />
              </div>
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
                className="registerButton"
                type="submit"
                block
              >
                Sign up
              </Button>
            </form>
            <div className="registerErrorMessage">
              {this.state.errorMessage}
            </div>
            Already have an account?
            <Link to="/login" className="loginLink">
              Log in!
            </Link>
          </div>
        </div>
      );
    }
  }
}
