//Import libraries
import React, { Component } from "react";

//Import assets
import MenuItemPlaceholder from "./menuitem-placeholder.png";

//Import stylesheets
import "./menuitem-component.css";

export default class MenuItemComponent extends Component {
  render() {
    return (
      <div
        className="MenuItem"
        onClick={() => this.props.renderPopUp(this.props.menuItem)}
      >
        <div className="MenuItemText">
          <div className="MenuItemName">{this.props.menuItem.name}</div>
          <div className="MenuItemDescription">
            {this.props.menuItem.description}
          </div>
          <div className="MenuItemPrice">
            {(this.props.menuItem.price / 100).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </div>
        <div className="MenuItemImage">
          <img src={MenuItemPlaceholder} alt={this.props.menuItem.name} />
        </div>
      </div>
    );
  }
}
