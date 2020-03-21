import React, { Component } from "react";
import Splash from "../components/splash/Splash";
import Navbar from "../components/nav/NavbarHomepage";

export default class Home extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Splash />
        <div style={{ height: 1200 }} />
      </div>
    );
  }
}
