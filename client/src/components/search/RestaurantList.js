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
      restaurants: []
    };

    //Get the "user" and "isUserLoaded" state variables from the GetLogin utility
    GetLogin(this.setState.bind(this));
  }

  componentDidMount() {
    //Fetch all restaurant data, and load into the restaurants variable
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

  //This method renders a restaurant for each object found in the "restaurants"
  restaurantList = () => {
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
  };

  //This method returns 7 "types" of restaurant in a for loop to choose from in a filter list.
  //Eventually, we will get this data from an api call
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

  //Returns types of filters applied to the search. For now, this is just a static number.
  //Todo: Apply filter just by clicking on tags or menu item types
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
