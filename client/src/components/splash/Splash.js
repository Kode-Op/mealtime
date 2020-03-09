import React, { Component } from "react";
import "./Splash.css";
import splashplaceholder from "./splashplaceholdershadow.png";

export default class Splash extends Component {
  render() {
    return (
      <img src={splashplaceholder} className="splashimg" alt="" width="100%" />
    );
  }
}
