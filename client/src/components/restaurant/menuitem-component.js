//Import libraries
import React from "react";

//Import assets
import MenuItemPlaceholder from "./menuitem-placeholder.png";

//Import stylesheets
import "./menuitem-component.css";

const MenuItemComponent = props => (
  <div className="MenuItem">
    <div className="MenuItemText">
      <div className="MenuItemName">{props.menuItem.name}</div>
      <div className="MenuItemDescription">{props.menuItem.description}</div>
    </div>
    <div className="MenuItemImage">
      <img src={MenuItemPlaceholder} alt={props.menuItem.name} />
    </div>
  </div>
);

export default MenuItemComponent;
