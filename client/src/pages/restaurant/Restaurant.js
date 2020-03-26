import React, { Component } from "react";
import { Link } from "react-router-dom";
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
        return (
          <div>
            <Navbar />
            <br />
            <br />
            <h3>Oops</h3>
            <br />
            <p>
              We weren't able to find the restaurant you are looking for. Sorry
              about that!
            </p>
            <p>
              Click <Link to="/search">here</Link> to return to your search.
            </p>
          </div>
        );
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
