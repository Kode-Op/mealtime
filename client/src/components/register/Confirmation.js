import React, { Component } from "react";

export default class Confirmation extends Component {
  render() {
    return (
      <div>
        <p>Test, 1, 2!</p>
        <p>firstName: {this.props.location.state.firstName}</p>
        <p>lastName: {this.props.location.state.lastName}</p>
        <p>email: {this.props.location.state.email}</p>
        <p>password: {this.props.location.state.password}</p>
      </div>
    );
  }
}
