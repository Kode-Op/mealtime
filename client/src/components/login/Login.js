import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Login.css";

export default class Login extends Component {
  render() {
    return (
      <div className="loginContainer">
        <h2 className="loginHeader">Welcome back</h2>
        <label htmlFor="email">Email</label>
        <input type="text" name="email" className="inputBox" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" className="inputBox" />
        <Button variant="success" className="loginButton" block>
          Login
        </Button>
        New to MealTime?
        <Link to="/register" className="registerLink">
          Sign up!
        </Link>
      </div>
    );
  }
}
