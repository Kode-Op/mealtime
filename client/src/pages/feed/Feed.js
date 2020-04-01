import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GetLogin from "../../utils/GetLogin";
import Navbar from "../../components/nav/Navbar";
import Loader from "../../assets/loader/Loader";

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    GetLogin(this.setState.bind(this));
  }

  render() {
    if (this.state.isUserLoaded) {
      if (this.state.user) {
        return (
          <div>
            <Navbar user={this.state.user} />
            <div>Hello, world</div>
          </div>
        );
      } else {
        return <Redirect to="/" />;
      }
    } else {
      return <Loader />;
    }
  }
}
