//Import libraries
import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import axios from "axios";

//Import components
import Navbar from "../nav/Navbar";
import RestaurantListComponent from "../search/restaurantlist-component";

//Import assets
import Loader from "../../assets/loader/Loader";
import Footer from "../footer/Footer";
import MenuItemTypePlaceholder from "./menuitemtypeplaceholder.png";

//Import utilities
import GetLogin from "../../utils/GetLogin";

//Import stylesheets
import "./RestaurantList.css";

export default class RestaurantList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      areRestaurantsLoaded: false,
      restaurants: [],
      appliedFilters: [],
    };
  }

  componentDidMount() {
    //Fetch all restaurant data, and load into the restaurants variable
    axios
      .get("/api/restaurants")
      .then((response) => {
        this.setState({
          restaurants: response.data,
          areRestaurantsLoaded: true,
        });
      })
      .catch(() => {
        this.setState({ areRestaurantsLoaded: true });
      });

    //Get "user" and "isUserLoaded" from the GetLogin utility
    GetLogin.then((response) => {
      this.setState({
        isUserLoaded: true,
        user: response,
      });
    }).catch(() => {
      this.setState({
        isUserLoaded: true,
      });
    });
  }

  //This method renders a restaurant for each object found in the "restaurants"
  restaurantList = () => {
    if (this.state.areRestaurantsLoaded) {
      return this.state.restaurants.map((currentRestaurant) => {
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
  };

  //This method returns 7 "types" of restaurant in a for loop to choose from in a filter list.
  //Eventually, we will get this data from an api call
  getPopularMenuItemTypes = () => {
    let rows = [];
    for (let i = 0; i < 7; i++) {
      rows.push(
        <div
          key={i}
          className="RestaurantMenuItemType"
          onClick={() => this.addFilter(i)}
        >
          <img src={MenuItemTypePlaceholder} alt="" />
          <div className="RestaurantMenuItemTypeDescription">Type {i + 1}</div>
        </div>
      );
    }
    return rows;
  };

  //Returns types of filters applied to the search. For now, this is just a static number.
  getAppliedFilters = () => {
    let rows = [];

    this.state.appliedFilters.map((item, i) =>
      rows.push(
        <div
          className="RestaurantListAppliedFilter"
          key={i}
          onClick={() => this.removeFilter(i)}
        >
          <div style={{ margin: "0 auto" }}>{this.state.appliedFilters[i]}</div>
        </div>
      )
    );

    return rows;
  };

  //This method appends a filter to this.state.appliedFilters if the filter isn't already included in the array
  addFilter = (i) => {
    let filters = this.state.appliedFilters;
    if (filters.indexOf("Type " + (i + 1)) === -1) {
      filters.push("Type " + (i + 1));
      this.setState({ appliedFilters: filters });
    }
  };

  //This method removes a filter from this.state.appliedFilters
  removeFilter = (i) => {
    let filters = this.state.appliedFilters;
    filters.splice(i, 1);
    this.setState({ appliedFilters: filters });
  };

  render() {
    if (this.state.isUserLoaded) {
      return (
        <div>
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
                  {this.getAppliedFilters()}
                </div>
              </div>
              <ListGroup className="RestaurantListGroup">
                {this.restaurantList()}
              </ListGroup>
            </div>
          </div>
          <Footer />
        </div>
      );
    } else {
      return <Loader />;
    }
  }
}
