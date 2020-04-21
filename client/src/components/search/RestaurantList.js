//Import libraries
import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
//import axios from "axios";

//Import components
import Navbar from "../nav/Navbar";
import RestaurantListComponent from "../search/restaurantlist-component";

//Import assets
import Loader from "../../assets/loader/Loader";
import Footer from "../footer/Footer";
//import MenuItemTypePlaceholder from "./menuitemtypeplaceholder.png";
import DisplayTag from "../../assets/displaytag/DisplayTag";
import TagBank from "../../utils/Tags";

//Import utilities
import {GetLogin} from "../../utils/GetLogin";
import {DataFetch} from "../../utils/search/DataFetch";

//Import stylesheets
import "./RestaurantList.css";

export default class RestaurantList extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      tags: TagBank,
      areRestaurantsLoaded: false,
      restaurants: [],
      appliedFilters: [],
      featuredTags: [5, 14, 16, 18, 22, 24, 25],
    };
  }

  componentDidMount() {
    this._isMounted = true;

    //Fetch all restaurant data, and load into the restaurants variable
    DataFetch("/api/restaurants")
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
    GetLogin()
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            isUserLoaded: true,
            user: response,
          });
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            isUserLoaded: true,
          });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
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
  getPopularMenuItemTypes = () => {
    let rows = [];

    this.state.featuredTags.forEach((currentTag) => {
      rows.push(
        <div>
          <div
            className="RestaurantMenuItemType"
            onClick={() => this.addFilter(currentTag)}
          >
            <DisplayTag tag={currentTag} size="small" style={{ width: 100 }} />
          </div>
          <div className="RestaurantMenuItemTypeDescription">
            {this.state.tags[currentTag]}
          </div>
        </div>
      );
    });
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
    if (filters.indexOf(this.state.tags[i]) === -1) {
      filters.push(this.state.tags[i]);
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
