import React, { Component } from "react";
<<<<<<< HEAD
import Splash from "../components/splash/Splash";
import Navbar from "../components/nav/NavbarHomepage";
=======
import Splash from "../components/splash/Splash"
import Navbar from "../components/nav/NavbarHomepage"
import Session from "../components/session_component"
>>>>>>> sessions

export default class Home extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Splash />
<<<<<<< HEAD
        <div style={{ height: 1200 }} />
=======
        <br /><br /><br /><br /><br /><br />
        <Session />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
>>>>>>> sessions
      </div>
    );
  }
}
