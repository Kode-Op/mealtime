import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loginError: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {}

  render() {
    return (
      <div className="loginContainer">
        <h2 className="loginHeader">Welcome back</h2>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          className="inputBox"
          value={this.state.email}
          onChange={this.handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          className="inputBox"
          value={this.state.password}
          onChange={this.handleChange}
          required
        />
        <Button variant="success" className="loginButton" type="submit" block>
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
