import React, { Component } from "react";
import { Button } from "react-bootstrap";
import "./Splash.css";
import splashplaceholder from "./splashplaceholdershadow.png";

export default class Splash extends Component {
  render() {
    return (
      <div className="splashcontainer">
        <img src={splashplaceholder} alt="" />
        <div className="splashzone">
          <h1>Any time can be MealTime.</h1>
          <form>
            <input
              type="text"
              name="address"
              className="splashbox"
              placeholder="Enter your address..."
            />
            <Button className="splashgo" variant="danger">
              >
            </Button>
          </form>
        </div>
      </div>
    );
  }
}
