import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import Navbar from "../../components/nav/Navbar";
import RestaurantListComponent from "../../components/search/restaurantlist-component";
import Loader from "../../assets/loader/Loader";
import GetLogin from "../../utils/GetLogin";
import Footer from "../footer/Footer";
import axios from "axios";
import MenuItemTypePlaceholder from "./menuitemtypeplaceholder.png";
import "./RestaurantList.css";

export default class RestaurantList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      areRestaurantsLoaded: false,
      restaurants: []
    };
    GetLogin(this.setState.bind(this));
  }
  componentDidMount() {
    axios
      .get("/api/restaurants")
      .then(response => {
        this.setState({
          restaurants: response.data,
          areRestaurantsLoaded: true
        });
      })
      .catch(() => {
        this.setState({ areRestaurantsLoaded: true });
      });
  }

  restaurantList() {
    if (this.state.areRestaurantsLoaded) {
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

  getPopularMenuItemTypes = () => {
    let rows = [];
    for (let i = 0; i < 7; i++) {
      rows.push(
        <div className="RestaurantMenuItemType">
          <img src={MenuItemTypePlaceholder} alt="" />
          <div className="RestaurantMenuItemTypeDescription">Type {i + 1}</div>
        </div>
      );
    }
    return rows;
  };

  getAppliedFilters = numFilters => {
    let rows = [];
    for (let i = 0; i < numFilters; i++) {
      rows.push(
        <div className="RestaurantListAppliedFilter">
          <div style={{ margin: "0 auto" }}>Filter {i + 1}</div>
        </div>
      );
    }
    return rows;
  };

  render() {
    if (this.state.isUserLoaded) {
      return (
        <div className="RestaurantListContainer">
          <Navbar user={this.state.user} />
          <div className="RestaurantListLeftPane">
            Filters selection will go here
          </div>
          <div className="RestaurantListRightPane">
            <div className="RestaurantListMostPopular">
              <h5>Most popular near you</h5>
              <div className="RestaurantMenuItemTypeContainer">
                {this.getPopularMenuItemTypes()}
              </div>
            </div>
            <div className="RestaurantListAppliedFilters">
              <h5>Applied filters:</h5>
              <div className="RestaurantListAppliedFilterContainer">
                {this.getAppliedFilters(4)} (example)
              </div>
            </div>
            <ListGroup className="RestaurantListGroup">
              {this.restaurantList()}
            </ListGroup>
          </div>
          <Footer />
        </div>
      );
    } else {
      return <Loader />;
    }
  }
}
