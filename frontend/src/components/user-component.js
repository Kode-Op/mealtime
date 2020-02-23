import React from "react";

const UserComponent = props => (
  <tr>
    <td>{props.apiKey._id}</td>
    <td>{props.apiKey.name}</td>
    <td>{props.apiKey.key}</td>
    <td>{props.apiKey.createdAt}</td>
    <td>{props.apiKey.updatedAt}</td>
    <td>{props.apiKey.__v}</td>
  </tr>
);

export default UserComponent;
