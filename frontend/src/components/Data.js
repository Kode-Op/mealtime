import React, { Component } from "react";
import axios from "axios";

export default class Data extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKeys: [],
      menuitems: [],
      orders: [],
      restaurants: [],
      reviews: [],
      users: []
    };
  }

  componentDidMount() {
    axios.get("http://localhost:5000/apiKeys").then(response => {
      this.setState({ apiKeys: response.data });
    });
    axios.get("http://localhost:5000/menuitems").then(response => {
      this.setState({ menuitems: response.data });
    });
    axios.get("http://localhost:5000/orders").then(response => {
      this.setState({ orders: response.data });
    });
    axios.get("http://localhost:5000/restaurants").then(response => {
      this.setState({ restaurants: response.data });
    });
    axios.get("http://localhost:5000/reviews").then(response => {
      this.setState({ reviews: response.data });
    });
    axios.get("http://localhost:5000/users").then(response => {
      this.setState({ users: response.data });
    });
  }

  render() {
    return <div>Data page</div>;
  }
}
