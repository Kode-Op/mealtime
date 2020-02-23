import React, { Component } from "react";
import axios from "axios";

const ApiKey = props => (
  <tr>
    <td>{props.apiKey._id}</td>
    <td>{props.apiKey.name}</td>
    <td>{props.apiKey.key}</td>
    <td>{props.apiKey.createdAt}</td>
    <td>{props.apiKey.updatedAt}</td>
    <td>{props.apiKey.__v}</td>
  </tr>
);

export default class Data extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apikeys: [],
      menuitems: [],
      orders: [],
      restaurants: [],
      reviews: [],
      users: []
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/apikeys")
      .then(response => {
        this.setState({ apikeys: response.data });
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get("http://localhost:5000/menuitems")
      .then(response => {
        this.setState({ menuitems: response.data });
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get("http://localhost:5000/orders")
      .then(response => {
        this.setState({ orders: response.data });
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get("http://localhost:5000/restaurants")
      .then(response => {
        this.setState({ restaurants: response.data });
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get("http://localhost:5000/reviews")
      .then(response => {
        this.setState({ reviews: response.data });
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get("http://localhost:5000/users")
      .then(response => {
        this.setState({ user: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  apiList() {
    return this.state.apikeys.map(currentAPI => {
      return <ApiKey apiKey={currentAPI} key={currentAPI._id} />;
    });
  }

  render() {
    return (
      <div>
        <h3>API Keys</h3>
        <table>
          <thead>
            <tr>
              <th>_id</th>
              <th>name</th>
              <th>key</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>__v</th>
            </tr>
          </thead>
          <tbody>{this.apiList()}</tbody>
        </table>
      </div>
    );
  }
}
