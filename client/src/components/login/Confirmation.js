import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default class LoginConfirmation extends Component {
  constructor(props) {
    super(props);
    /*
    const user = {
      email: this.props.location.state.email,
      password: this.props.location.state.password
    };
    */
    this.state = { redirect: false };
  }

  componentDidMount() {
    this.id = setTimeout(() => this.setState({ redirect: true }), 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.id);
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    } else {
      return (
        <div>
          <p>{this.props.location.state.email}</p>
          <p>{this.props.location.state.password}</p>
        </div>
      );
    }
  }
}
