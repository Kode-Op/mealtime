import React, { Component } from "react";
import axios from "axios";

export default class Confirmation extends Component {
  constructor(props) {
    super(props);
    const user = {
      firstName: this.props.location.state.firstName,
      lastName: this.props.location.state.lastName,
      email: this.props.location.state.email,
      password: this.props.location.state.password
    };
    axios.post("/api/users/add", user).then(res => console.log(res.data));
  }

  render() {
    return (
      <div>
        <p>Test, 1, 2!</p>
      </div>
    );
  }
}
