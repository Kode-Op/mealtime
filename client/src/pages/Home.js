import React, { Component } from "react";
import Splash from "../components/splash/Splash"
import Navbar from "../components/nav/Navbar"
import Session from "../components/session_component"

export default class Home extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Splash />
        <br /><br /><br /><br /><br /><br />
        <Session />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </div>
    );
  }
}
