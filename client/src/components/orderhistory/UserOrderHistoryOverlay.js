//Import libraries
import React, { Component } from "react";
import { Button } from "react-bootstrap";

//Import utilities
import { DeleteOrder } from "../../utils/axios/Orders";

//Import stylesheets
import "./UserOrderHistoryOverlay.css";

//This class renders a popup text box that asks the user if they
//would like to cancel their order
export default class UserOrderHistoryOverlay extends Component {
  onCancelPopUp = (e) => {
    e.preventDefault();
    if (
      e.target === e.currentTarget ||
      e.target.className === "UserOrderHistoryOverlayExitButton"
    ) {
      this.props.cancelPopUp();
    }
  };

  onCancelOrder = () => {
    console.log("?");
    DeleteOrder(this.props.orderID)
      .then((response) => {
        console.log(response);
        window.location.reload(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div
        className="UserOrderHistoryOverlayBackground"
        onClick={(e) => this.onCancelPopUp(e)}
      >
        <div className="UserOrderHistoryOverlayPopup">
          <div className="UserOrderHistoryOverlayExitButton">✖</div>
          <h5>Do you want to cancel this order?</h5>
          <br />
          <Button variant="danger" onClick={() => this.onCancelOrder()}>
            Cancel order
          </Button>
        </div>
      </div>
    );
  }
}
