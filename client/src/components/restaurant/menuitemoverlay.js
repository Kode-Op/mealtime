//Import libraries
import React, { Component } from "react";
import { Button } from "react-bootstrap";

//Import assets
import MenuItemPlaceholder from "./menuitem-placeholder-large.png";

//Import stylesheets
import "./menuitemoverlay.css";
import { setInStorage, getFromStorage } from "../../utils/storage";

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

  addToCart = (menuItem, quantity, restaurant) => {
    let currentStorage = getFromStorage("shoppingbag");
    let currentRestaurant = getFromStorage("restaurant");
    let menuItems = [];
    //If there's no items in the cart, create a new array of length 1
    //with the menu item and quantity and set it in storage
    if (currentStorage === null || currentRestaurant === null) {
      menuItems = [
        {
          menuItem,
          quantity,
          time: Date.now(),
        },
      ];
      //Since we're communicating to a sibling component (the navbar), we need to call
      //a change handler in Restaurant.js to pass the menuItems to the navbar as a prop
      //after setting it in storage
      setInStorage("shoppingbag", { menuItems }).then(() => {
        this.props.addToBag(menuItems);
      });
      setInStorage("restaurant", restaurant).then(() => {
        this.props.addRestaurantToBag(restaurant);
      });

      //Otherwise, append the menu item to the array already set in storage
    } else {
      if (restaurant._id === currentRestaurant._id) {
        menuItems = currentStorage.menuItems.concat({
          menuItem,
          quantity,
          time: Date.now(),
        });
        setInStorage("shoppingbag", { menuItems }).then(() => {
          this.props.addToBag(menuItems);
        });
      } else {
        if (
          window.confirm(
            "This will replace the items from " +
              currentRestaurant.name +
              ". Do you want to start a new order?"
          )
        ) {
          menuItems = [{ menuItem, quantity, time: Date.now() }];
          setInStorage("shoppingbag", { menuItems }).then(() => {
            this.props.addToBag(menuItems);
          });
          setInStorage("restaurant", restaurant).then(() => {
            this.props.addRestaurantToBag(restaurant);
          });
        }
      }
    }
    this.props.cancelPopUp();
  };

  convertToPrice = (quantity, price) => {
    return ((price * quantity) / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  render() {
    const { _id, name, description, price } = this.props.menuItem;

    return (
      <div
        className="MenuItemOverlayBackground"
        onClick={(e) => this.onCancelItem(e)}
      >
        <div className="MenuItemOverlayPopup">
          <div className="MenuItemOverlayExitButton">✖</div>
          <h3>{name}</h3>
          <p>{description}</p>
          <img
            src={
              "https://mealtimebucket.s3-us-west-1.amazonaws.com/" +
              _id +
              "/large.png"
            }
            onError={(e) => {
              e.target.setAttribute("src", MenuItemPlaceholder);
              e.target.onerror = null;
            }}
            alt=""
          />
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
                onClick={() =>
                  this.addToCart(
                    this.props.menuItem,
                    this.state.quantity,
                    this.props.restaurant
                  )
                }
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
