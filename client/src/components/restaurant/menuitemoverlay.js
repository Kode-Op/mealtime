//Import libraries
import React, { Component } from "react";
import { Button } from "react-bootstrap";

//Import assets
import MenuItemPlaceholder from "./menuitem-placeholder-large.png";

//Import stylesheets
import "./menuitemoverlay.css";

export default class MenuItemOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 1,
    };
  }

  onCancelItem = (e) => {
    e.preventDefault();
    if (
      e.target === e.currentTarget ||
      e.target.className === "MenuItemOverlayExitButton"
    ) {
      this.props.cancelPopUp();
    }
  };

  onChangeQuantity = (e) => {
    e.preventDefault();

    if (e.target.value === "") {
      this.setState({
        quantity: "",
      });
      return;
    }

    if (isNaN(e.target.value) || e.target.value <= 0 || e.target.value > 100) {
      return;
    }

    this.setState({
      quantity: parseInt(e.target.value, 10),
    });
  };

  addQuantity = (quantity) => {
    if (++quantity < 100) {
      this.setState({
        quantity: quantity,
      });
    }
  };

  removeQuantity = (quantity) => {
    if (--quantity > 0) {
      this.setState({
        quantity: quantity,
      });
    }
  };

  convertToPrice = (quantity, price) => {
    return ((price * quantity) / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  render() {
    const { name, description, price } = this.props.menuItem;

    return (
      <div
        className="MenuItemOverlayBackground"
        onClick={(e) => this.onCancelItem(e)}
      >
        <div className="MenuItemOverlayPopup">
          <div className="MenuItemOverlayExitButton">✖</div>
          <h3>{name}</h3>
          <p>{description}</p>
          <img src={MenuItemPlaceholder} alt="" />
          <div className="MenuItemOverlayBottomFlex">
            <div className="MenuItemOverlayQuantity">
              Quantity:
              <div
                className="MenuItemOverlayMinus"
                onClick={() => this.removeQuantity(this.state.quantity)}
              >
                -
              </div>
              <input
                type="text"
                name="quantity"
                className="MenuItemOverlayQuantityInput"
                value={this.state.quantity}
                onChange={this.onChangeQuantity}
              />
              <div
                className="MenuItemOverlayPlus"
                onClick={() => this.addQuantity(this.state.quantity)}
              >
                +
              </div>
            </div>
            <div className="MenuItemOverlayAddToCart">
              <Button
                variant={this.state.quantity > 0 ? "success" : "secondary"}
                disabled={this.state.quantity === ""}
              >
                Add to cart - {this.convertToPrice(this.state.quantity, price)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
