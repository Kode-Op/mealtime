import React, { Component } from "react";
import "./Splash.css";
import splashplaceholder from "./splashplaceholder.png";

export default class Splash extends Component {
  render() {
    return <img src={splashplaceholder} className="splashimg" width="100%" />;
  }
}
