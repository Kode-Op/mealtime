import React, { Component } from "react";
import "./Splash.css";
import splashplaceholder from "./splashplaceholder.jpg"

export default class Splash extends Component {
  render() {
    return (
      <img src={splashplaceholder} className="splashimg" width="100%"/>
    );
  }
}
