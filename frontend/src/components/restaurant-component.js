import React, { Component } from "react";

export default class RestaurantComponent extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.restaurant._id}</td>
        <td>
          {this.props.restaurant.tag.map(currentTag => (
            <React.Fragment>
              ({currentTag[0]}, {currentTag[1]})<br />
            </React.Fragment>
          ))}
        </td>
        <td>
          {this.props.restaurant.menuitem.map(currentOrder => (
            <React.Fragment>
              ({currentOrder})<br />
            </React.Fragment>
          ))}
        </td>
        <td>
          <b>Sunday: </b>
          {this.props.restaurant.hoursofoperation[0][0]}-
          {this.props.restaurant.hoursofoperation[0][1]},{" "}
          {this.props.restaurant.hoursofoperation[0][2]}-
          {this.props.restaurant.hoursofoperation[0][3]}
          <br />
          <b>Monday: </b>
          {this.props.restaurant.hoursofoperation[1][0]}-
          {this.props.restaurant.hoursofoperation[1][1]},{" "}
          {this.props.restaurant.hoursofoperation[1][2]}-
          {this.props.restaurant.hoursofoperation[1][3]}
          <br />
          <b>Tuesday: </b>
          {this.props.restaurant.hoursofoperation[2][0]}-
          {this.props.restaurant.hoursofoperation[2][1]},{" "}
          {this.props.restaurant.hoursofoperation[2][2]}-
          {this.props.restaurant.hoursofoperation[2][3]}
          <br />
          <b>Wednesday: </b>
          {this.props.restaurant.hoursofoperation[3][0]}-
          {this.props.restaurant.hoursofoperation[3][1]},{" "}
          {this.props.restaurant.hoursofoperation[3][2]}-
          {this.props.restaurant.hoursofoperation[3][3]}
          <br />
          <b>Thursday: </b>
          {this.props.restaurant.hoursofoperation[4][0]}-
          {this.props.restaurant.hoursofoperation[4][1]},{" "}
          {this.props.restaurant.hoursofoperation[4][2]}-
          {this.props.restaurant.hoursofoperation[4][3]}
          <br />
          <b>Friday: </b>
          {this.props.restaurant.hoursofoperation[5][0]}-
          {this.props.restaurant.hoursofoperation[5][1]},{" "}
          {this.props.restaurant.hoursofoperation[5][2]}-
          {this.props.restaurant.hoursofoperation[5][3]}
          <br />
          <b>Saturday: </b>
          {this.props.restaurant.hoursofoperation[6][0]}-
          {this.props.restaurant.hoursofoperation[6][1]},{" "}
          {this.props.restaurant.hoursofoperation[6][2]}-
          {this.props.restaurant.hoursofoperation[6][3]}
          <br />
        </td>
        <td>{this.props.restaurant.name}</td>
        <td>{this.props.restaurant.price}</td>
        <td>{this.props.restaurant.rating}</td>
        <td>{this.props.restaurant.description}</td>
        <td>{this.props.restaurant.minorder}</td>
        <td>{this.props.restaurant.location.x_coordinate}</td>
        <td>{this.props.restaurant.location.y_coordinate}</td>
        <td>{this.props.restaurant.createdAt}</td>
        <td>{this.props.restaurant.updatedAt}</td>
        <td>{this.props.restaurant.__v}</td>
      </tr>
    );
  }
}
