import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Register.css";
//import axios from 'axios';

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
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

  onSubmit(e) {
    e.preventDefault();

    const user = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    }

    console.log(user);

    window.location = '/'; // Go to the home page on submit
  }


  render() {
    return (
      <div className="registerContainer">
        <h2 className="registerHeader">Create your account</h2>
        <div className="registerDivSplitLeft">
          <label htmlFor="fName">First name</label>
          <input type="text" 
            required 
            name="fName" 
            className="inputBox" 
            value={this.state.firstName}
            onChange={this.onChangeFirstName}
            />
        </div>
        <div className="registerDivSplitRight">
          <label htmlFor="lName">Last name</label>
          <input type="text" 
            required
            name="lName" 
            className="inputBox" 
            value={this.state.lastName}
            onChange={this.onChangeLastName}
            />
        </div>
        <label htmlFor="email">Email</label>
        <input type="text" 
          required
          name="email" 
          className="inputBox"
          value={this.state.email}
          onChange={this.onChangeEmail} 
          />
        <label htmlFor="password">Password</label>
        <input type="password" 
          required
          name="password" 
          className="inputBox" 
          value={this.state.password}
          onChange={this.onChangePassword}
          />
        <Button variant="success" className="registerButton" block>
          Sign up
        </Button>
        Already have an account?
        <Link to="/login" className="loginLink">
          Log in!
        </Link>
      </div>
    );
  }
}
