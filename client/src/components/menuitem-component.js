import React from "react";

const MenuItemComponent = props => (
  <tr>
    <td>{props.menuItem._id}</td>
    <td>{props.menuItem.name}</td>
    <td>{props.menuItem.price}</td>
    <td>{props.menuItem.preptime}</td>
    <td>{props.menuItem.description}</td>
    <td>{props.menuItem.tag}</td>
    <td>{props.menuItem.createdAt}</td>
    <td>{props.menuItem.updatedAt}</td>
    <td>{props.menuItem.__v}</td>
  </tr>
);

export default MenuItemComponent;
