//Import libraries
import React, { Component } from "react";

//Import assets
import MenuItemPlaceholder from "./menuitem-placeholder.png";

//Import stylesheets
import "./menuitem-component.css";

export default class MenuItemComponent extends Component {
  render() {
    const { _id, name, description, price } = this.props.menuItem;

    return (
      <div
        className="MenuItem"
        onClick={() => this.props.renderPopUp(this.props.menuItem)}
      >
        <div className="MenuItemText">
          <div className="MenuItemName">{name}</div>
          <div className="MenuItemDescription">{description}</div>
          <div className="MenuItemPrice">
            {(price / 100).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </div>
        <div className="MenuItemImage">
          <img
            src={
              "https://mealtimebucket.s3-us-west-1.amazonaws.com/" +
              _id +
              "/small.png"
            }
            onError={(e) => {
              e.target.setAttribute("src", MenuItemPlaceholder);
              e.target.onerror = null;
            }}
            alt=""
          />
        </div>
      </div>
    );
  }
}
