import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import Navbar from "../../components/nav/Navbar";
import RestaurantListComponent from "../../components/search/restaurantlist-component";
import Loader from "../../assets/loader/Loader";
import axios from "axios";
import "./RestaurantList.css";

export default class RestaurantList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      restaurants: []
    };
  }
  componentDidMount() {
    axios
      .get("/api/restaurants")
      .then(response => {
        this.setState({ restaurants: response.data, isLoaded: true });
      })
      .catch(error => {
        this.setState({ isLoaded: true });
      });
  }

  restaurantList() {
    if (this.state.isLoaded) {
      return this.state.restaurants.map(currentRestaurant => {
        return (
          <RestaurantListComponent
            restaurant={currentRestaurant}
            key={currentRestaurant._id}
          />
        );
      });
    } else {
      return <Loader />;
    }
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
