import React, { Component } from "react";
import axios from "axios";
import Navbar from "../../components/nav/Navbar";
import Loader from "../../assets/loader/Loader";

export default class Restaurant extends Component {
  constructor(props) {
    super(props);
    this.state = { isValidRestaurant: false, isLoaded: false };
  }

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const id = query.get("id");

    axios
      .get("/api/restaurants/" + id)
      .then(response => {
        this.setState({
          restaurant: response.data,
          isValidRestaurant: true,
          isLoaded: true
        });
      })
      .catch(error => {
        this.setState({ isValidRestaurant: false, isLoaded: true });
      });
  }

  render() {
    if (this.state.isLoaded) {
      if (this.state.isValidRestaurant) {
        return (
          <div>
            <Navbar />
            <h4>You are on a restaurant page</h4>
            <div style={{ height: 1200 }} />
          </div>
        );
      } else {
        return <div>Wrong restaurant, buddy.</div>;
      }
    } else {
      return (
        <div>
          <Navbar />
          <div style={{ height: 60 }} />
          <Loader />
        </div>
      );
    }
  }
}
