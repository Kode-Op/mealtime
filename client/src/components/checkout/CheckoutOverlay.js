//Import libraries
import React, { Component } from "react";
import { Link } from "react-router-dom";

//Import stylesheets
import "./CheckoutOverlay.css";

//This class renders a popup text box that prompts the user to login
export default class CheckoutOverlay extends Component {
  render() {
    return (
      <div className="CheckoutOverlayBackground">
        <div className="CheckoutOverlayPopup">
          <h5>
            To continue with this checkout, please{" "}
            <Link to="/login">login</Link> before proceeding.
          </h5>
        </div>
      </div>
    );
  }
}
