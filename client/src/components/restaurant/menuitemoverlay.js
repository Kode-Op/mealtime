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
    if (e.target === e.currentTarget) {
      this.props.cancelPopUp();
    }
  };

  onChangeQuantity = (e) => {
    e.preventDefault();
    this.setState({
      quantity: e.target.value,
    });
  };

  addQuantity = () => {
    let quantity = this.state.quantity + 1;
    this.setState({
      quantity: quantity,
    });
  };

  removeQuantity = () => {
    let quantity = this.state.quantity - 1;
    if (quantity > 0) {
      this.setState({
        quantity: quantity,
      });
    }
  };

  render() {
    return (
      <div
        className="MenuItemOverlayBackground"
        onClick={(e) => this.onCancelItem(e)}
      >
        <div className="MenuItemOverlayPopup">
          <h3>{this.props.menuItem.name}</h3>
          <p>{this.props.menuItem.description}</p>
          <img src={MenuItemPlaceholder} alt="" />
          <div className="MenuItemOverlayBottomFlex">
            <div className="MenuItemOverlayQuantity">
              Quantity:
              <div
                className="MenuItemOverlayMinus"
                onClick={() => this.removeQuantity()}
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
                onClick={() => this.addQuantity()}
              >
                +
              </div>
            </div>
            <div className="MenuItemOverlayAddToCart">
              <Button variant="success">
                Add to cart -{" "}
                {(
                  (this.props.menuItem.price * this.state.quantity) /
                  100
                ).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
