import React from "react";

const UserComponent = props => (
  <tr>
    <td>{props.user._id}</td>
    <td>
      {props.user.preferencesTag.map(currentTag => (
        <React.Fragment>
          {currentTag}
          <br />
        </React.Fragment>
      ))}
    </td>
    <td>
      {props.user.orderHistory.map(currentOrder => (
        <React.Fragment>
          {currentOrder}
          <br />
        </React.Fragment>
      ))}
    </td>
    <td>{props.user.userID}</td>
    <td>{props.user.email}</td>
    <td>{props.user.userName}</td>
    <td>{props.user.firstName}</td>
    <td>{props.user.lastName}</td>
    <td>{props.user.password}</td>
    <td>{props.user.creditCardName}</td>
    <td>{props.user.creditCardNumber}</td>
    <td>{props.user.creditCardCCV}</td>
    <td>{props.user.expMonth}</td>
    <td>{props.user.expYear}</td>
    <td>{props.user.location.x_coordinate}</td>
    <td>{props.user.location.y_coordinate}</td>
    <td>{props.user.createdAt}</td>
    <td>{props.user.updatedAt}</td>
    <td>{props.user.__v}</td>
  </tr>
);

export default UserComponent;
