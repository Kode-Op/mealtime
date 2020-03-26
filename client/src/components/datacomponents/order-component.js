import React from "react";

const OrderComponent = props => (
  <tr>
    <td>{props.order._id}</td>
    <td>{props.order.userID}</td>
    <td>{props.order.restaurantID}</td>
    <td>{props.order.deliverylocation.x_coordinate}</td>
    <td>{props.order.deliverylocation.y_coordinate}</td>
    <td>{props.order.createdAt}</td>
    <td>{props.order.updatedAt}</td>
    <td>{props.order.__v}</td>
  </tr>
);

export default OrderComponent;
