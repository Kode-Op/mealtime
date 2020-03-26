import React, { Component } from "react";
import Splash from "../components/splash/Splash";
import Navbar from "../components/nav/NavbarHomepage";
import Session from "../components/session_component";

export default class Home extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Splash />
        <Session />
        <div style={{ height: 1200 }} />
      </div>
    );
  }
}
