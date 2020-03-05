import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Register.css";

export default class Register extends Component {
  render() {
    return (
      <div className="registerContainer">
        <h2 className="registerHeader">Create your account</h2>
        <div className="registerDivSplitLeft">
          <label htmlFor="fName">First name</label>
          <input type="text" name="fName" className="inputBox" />
        </div>
        <div className="registerDivSplitRight">
          <label htmlFor="lName">Last name</label>
          <input type="text" name="lName" className="inputBox" />
        </div>
        <label htmlFor="email">Email</label>
        <input type="text" name="email" className="inputBox" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" className="inputBox" />
        <Button variant="success" className="registerButton" block>
          Login
        </Button>
        Already have an account?
        <Link to="/login" className="loginLink">
          Register!
        </Link>
      </div>
    );
  }
}
