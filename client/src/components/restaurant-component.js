import React from "react";

const RestaurantComponent = props => (
  <tr>
    <td>{props.restaurant._id}</td>
    <td>
      {props.restaurant.tag.map(currentTag => (
        <React.Fragment>
          ({currentTag[0]}, {currentTag[1]})<br />
        </React.Fragment>
      ))}
    </td>
    <td>
      {props.restaurant.menuitem.map(currentOrder => (
        <React.Fragment>
          ({currentOrder})<br />
        </React.Fragment>
      ))}
    </td>
    <td>
      <b>Sunday: </b>
      {props.restaurant.hoursofoperation[0][0]}-
      {props.restaurant.hoursofoperation[0][1]},{" "}
      {props.restaurant.hoursofoperation[0][2]}-
      {props.restaurant.hoursofoperation[0][3]}
      <br />
      <b>Monday: </b>
      {props.restaurant.hoursofoperation[1][0]}-
      {props.restaurant.hoursofoperation[1][1]},{" "}
      {props.restaurant.hoursofoperation[1][2]}-
      {props.restaurant.hoursofoperation[1][3]}
      <br />
      <b>Tuesday: </b>
      {props.restaurant.hoursofoperation[2][0]}-
      {props.restaurant.hoursofoperation[2][1]},{" "}
      {props.restaurant.hoursofoperation[2][2]}-
      {props.restaurant.hoursofoperation[2][3]}
      <br />
      <b>Wednesday: </b>
      {props.restaurant.hoursofoperation[3][0]}-
      {props.restaurant.hoursofoperation[3][1]},{" "}
      {props.restaurant.hoursofoperation[3][2]}-
      {props.restaurant.hoursofoperation[3][3]}
      <br />
      <b>Thursday: </b>
      {props.restaurant.hoursofoperation[4][0]}-
      {props.restaurant.hoursofoperation[4][1]},{" "}
      {props.restaurant.hoursofoperation[4][2]}-
      {props.restaurant.hoursofoperation[4][3]}
      <br />
      <b>Friday: </b>
      {props.restaurant.hoursofoperation[5][0]}-
      {props.restaurant.hoursofoperation[5][1]},{" "}
      {props.restaurant.hoursofoperation[5][2]}-
      {props.restaurant.hoursofoperation[5][3]}
      <br />
      <b>Saturday: </b>
      {props.restaurant.hoursofoperation[6][0]}-
      {props.restaurant.hoursofoperation[6][1]},{" "}
      {props.restaurant.hoursofoperation[6][2]}-
      {props.restaurant.hoursofoperation[6][3]}
      <br />
    </td>
    <td>{props.restaurant.name}</td>
    <td>{props.restaurant.price}</td>
    <td>{props.restaurant.rating}</td>
    <td>{props.restaurant.description}</td>
    <td>{props.restaurant.minorder}</td>
    <td>{props.restaurant.location.x_coordinate}</td>
    <td>{props.restaurant.location.y_coordinate}</td>
    <td>{props.restaurant.createdAt}</td>
    <td>{props.restaurant.updatedAt}</td>
    <td>{props.restaurant.__v}</td>
  </tr>
);

export default RestaurantComponent;
