import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import Navbar from "../../components/nav/Navbar";
import RestaurantListComponent from "../../components/search/restaurantlist-component";
import axios from "axios";
import "./RestaurantList.css";

export default class RestaurantList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurants: []
    };
  }
  componentDidMount() {
    axios
      .get("/api/restaurants")
      .then(response => {
        this.setState({ restaurants: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  restaurantList() {
    return this.state.restaurants.map(currentRestaurant => {
      return (
        <RestaurantListComponent
          restaurant={currentRestaurant}
          key={currentRestaurant._id}
        />
      );
    });
  }
  render() {
    return (
      <div className="RestaurantListContainer">
        <Navbar />
        <div className="RestaurantListLeftPane">
          Filters selection will go here
        </div>
        <div className="RestaurantListRightPane">
          <div className="RestaurantListAppliedFilters">
            Applied filters will go here.
          </div>
          <ListGroup className="RestaurantListGroup">
            {this.restaurantList()}
          </ListGroup>
        </div>
      </div>
    );
  }
}
