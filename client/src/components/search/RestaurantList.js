//Import libraries
import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";

//Import components
import Navbar from "../nav/Navbar";
import RestaurantListComponent from "../search/restaurantlist-component";

//Import assets
import Loader from "../../assets/loader/Loader";
import Footer from "../footer/Footer";
import DisplayTag from "../../assets/displaytag/DisplayTag";
import TagBank from "../../utils/Tags";
import Star from "./star.png";
import StarSelected from "./starselected.png";
import Dollar from "./dollar.png";
import DollarSelected from "./dollarselected.png";

//Import utilities
import GetLogin from "../../utils/GetLogin";
import {
  GetRestaurants,
  GetFilteredRestaurants,
} from "../../utils/axios/Restaurants";

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
      starHover: 0,
      starSelected: 0,
      priceLow: 0,
      priceLowHover: 0,
      priceHigh: 5,
      priceHighHover: 5,
    };
  }

  renderRestaurants = (appliedFilters, rating, priceLow, priceHigh) => {
    const pkg = {
      userId: this.state.user ? this.state.user._id : null,
      tags: appliedFilters,
      ratings: rating * 2,
      priceLow: priceLow,
      priceHigh: priceHigh,
    };

    console.log(pkg);

    GetFilteredRestaurants(pkg)
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            restaurants: response.data,
            areRestaurantsLoaded: true,
          });
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({ areRestaurantsLoaded: true });
        }
      });
  };

  componentDidMount() {
    this._isMounted = true;

    //Get "user" and "isUserLoaded" from the GetLogin utility
    GetLogin()
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            isUserLoaded: true,
            user: response,
          });
        }

        //Fetch all restaurant data, sorted by user preference
        this.renderRestaurants([], 0, 0, 5);
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            isUserLoaded: true,
          });
        }

        //Fetch all restaurant data, and load into the restaurants variable
        GetRestaurants()
          .then((response) => {
            this.setState({
              restaurants: response.data,
              areRestaurantsLoaded: true,
            });
          })
          .catch(() => {
            this.setState({ areRestaurantsLoaded: true });
          });
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

    this.state.featuredTags.forEach((currentTag, index) => {
      rows.push(
        <div key={index}>
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

  getDollarSigns = (price) => {
    switch (price) {
      case 1:
        return "$";
      case 2:
        return "$$";
      case 3:
        return "$$$";
      case 4:
        return "$$$$";
      case 5:
        return "$$$$$";
      default:
        return "";
    }
  };

  //Returns types of filters applied to the search. For now, this is just a static number.
  getAppliedFilters = () => {
    const {
      starSelected,
      priceLow,
      priceHigh,
      appliedFilters,
      tags,
    } = this.state;
    let rows = [];

    if (starSelected > 0) {
      rows.push(
        <div
          className="RestaurantListAppliedFilter"
          onClick={() => this.setRating(starSelected)}
        >
          <div style={{ margin: "0 auto" }}>
            {starSelected}
            {starSelected !== 5 ? "+" : ""} stars
          </div>
        </div>
      );
    }

    if (priceLow === priceHigh) {
      rows.push(
        <div
          className="RestaurantListAppliedFilter"
          onClick={() => this.resetPrice()}
        >
          <div style={{ margin: "0 auto", width: 400 }}>
            Price: {this.getDollarSigns(priceLow)}
          </div>
        </div>
      );
    } else if (priceLow === 0 && priceHigh !== 5) {
      rows.push(
        <div
          className="RestaurantListAppliedFilter"
          onClick={() => this.resetPrice()}
        >
          <div style={{ margin: "0 auto", width: 400 }}>
            Max price: {this.getDollarSigns(priceHigh)}
          </div>
        </div>
      );
    } else if (priceLow !== 0 && priceHigh === 5) {
      rows.push(
        <div
          className="RestaurantListAppliedFilter"
          onClick={() => this.resetPrice()}
        >
          <div style={{ margin: "0 auto", width: 400 }}>
            Min price: {this.getDollarSigns(priceLow)}
          </div>
        </div>
      );
    } else if (priceLow !== 0 && priceHigh !== 5) {
      rows.push(
        <div
          className="RestaurantListAppliedFilter"
          onClick={() => this.resetPrice()}
        >
          <div style={{ margin: "0 auto", width: 400 }}>
            Price: {this.getDollarSigns(priceLow)}-
            {this.getDollarSigns(priceHigh)}
          </div>
        </div>
      );
    }

    appliedFilters.map((item, i) =>
      rows.push(
        <div
          className="RestaurantListAppliedFilter"
          key={i}
          onClick={() => this.removeFilter(i)}
        >
          <div style={{ margin: "0 auto" }}>{tags[item]}</div>
        </div>
      )
    );

    return rows;
  };

  //This method appends a filter to this.state.appliedFilters if the filter isn't already included in the array
  addFilter = (i) => {
    let filters = this.state.appliedFilters;
    if (filters.indexOf(i) === -1) {
      filters.push(i);
      this.setState({ appliedFilters: filters });

      //Rerender the restaurants
      this.renderRestaurants(
        filters,
        this.state.starSelected,
        this.state.priceLow,
        this.state.priceHigh
      );
    }
  };

  //This method removes a filter from this.state.appliedFilters
  removeFilter = (i) => {
    let filters = this.state.appliedFilters;
    filters.splice(i, 1);
    this.setState({ appliedFilters: filters });

    //Rerender the restaurants
    this.renderRestaurants(
      filters,
      this.state.starSelected,
      this.state.priceLow,
      this.state.priceHigh
    );
  };

  resetPrice = () => {
    this.setState({
      priceLow: 0,
      priceLowHover: 0,
      priceHigh: 5,
      priceHighHover: 5,
    });
    this.renderRestaurants(
      this.state.appliedFilters,
      this.state.starSelected,
      0,
      5
    );
  };

  setRating = (rating) => {
    if (rating !== this.state.starSelected) {
      this.setState({
        starSelected: rating,
      });
      this.renderRestaurants(
        this.state.appliedFilters,
        rating,
        this.state.priceLow,
        this.state.priceHigh
      );
    } else {
      this.setState({
        starSelected: 0,
        starHover: 0,
      });
      this.renderRestaurants(
        this.state.appliedFilters,
        0,
        this.state.priceLow,
        this.state.priceHigh
      );
    }
  };

  setPriceLow = (price) => {
    if (price !== this.state.priceLow) {
      this.setState({
        priceLow: price,
      });
    } else {
      this.setState({
        priceLow: 0,
        priceLowHover: 0,
      });
      price = 0;
    }

    let priceHigh = this.state.priceHigh;
    if (price > priceHigh) {
      this.setState({
        priceHigh: price,
        priceHighHover: price,
      });
      priceHigh = price;
    }

    this.renderRestaurants(
      this.state.appliedFilters,
      this.state.starSelected,
      price,
      priceHigh
    );
  };

  setPriceHigh = (price) => {
    if (price !== this.state.priceHigh) {
      this.setState({
        priceHigh: price,
      });
    } else {
      this.setState({
        priceHigh: 5,
        priceHighHover: 5,
      });
      price = 5;
    }

    let priceLow = this.state.priceLow;
    if (price < priceLow) {
      this.setState({
        priceLow: price,
        priceLowHover: price,
      });
      priceLow = price;
    }
    this.renderRestaurants(
      this.state.appliedFilters,
      this.state.starSelected,
      priceLow,
      price
    );
  };

  render() {
    if (this.state.isUserLoaded) {
      return (
        <div>
          <div className="RestaurantListContainer">
            <Navbar user={this.state.user} />
            <div className="RestaurantListLeftPane">
              <h4>Filters</h4>
              <h5>Rating</h5>
              <img
                src={this.state.starHover >= 1 ? StarSelected : Star}
                alt="1 and above"
                onMouseEnter={() => {
                  this.setState({ starHover: 1 });
                }}
                onMouseOut={() => {
                  this.setState({ starHover: this.state.starSelected });
                }}
                onClick={() => this.setRating(1)}
              />
              <img
                src={this.state.starHover >= 2 ? StarSelected : Star}
                alt="2 and above"
                onMouseEnter={() => {
                  this.setState({ starHover: 2 });
                }}
                onMouseOut={() => {
                  this.setState({ starHover: this.state.starSelected });
                }}
                onClick={() => this.setRating(2)}
              />
              <img
                src={this.state.starHover >= 3 ? StarSelected : Star}
                alt="3 and above"
                onMouseEnter={() => {
                  this.setState({ starHover: 3 });
                }}
                onMouseOut={() => {
                  this.setState({ starHover: this.state.starSelected });
                }}
                onClick={() => this.setRating(3)}
              />
              <img
                src={this.state.starHover >= 4 ? StarSelected : Star}
                alt="4 and above"
                onMouseEnter={() => {
                  this.setState({ starHover: 4 });
                }}
                onMouseOut={() => {
                  this.setState({ starHover: this.state.starSelected });
                }}
                onClick={() => this.setRating(4)}
              />
              <img
                src={this.state.starHover >= 5 ? StarSelected : Star}
                alt="5 and above"
                onMouseEnter={() => {
                  this.setState({ starHover: 5 });
                }}
                onMouseOut={() => {
                  this.setState({ starHover: this.state.starSelected });
                }}
                onClick={() => this.setRating(5)}
              />
              <h5>Minimum price</h5>
              <img
                src={this.state.priceLowHover >= 1 ? DollarSelected : Dollar}
                alt="1 and above"
                onMouseEnter={() => {
                  this.setState({ priceLowHover: 1 });
                }}
                onMouseOut={() => {
                  this.setState({ priceLowHover: this.state.priceLow });
                }}
                onClick={() => this.setPriceLow(1)}
              />
              <img
                src={this.state.priceLowHover >= 2 ? DollarSelected : Dollar}
                alt="2 and above"
                onMouseEnter={() => {
                  this.setState({ priceLowHover: 2 });
                }}
                onMouseOut={() => {
                  this.setState({ priceLowHover: this.state.priceLow });
                }}
                onClick={() => this.setPriceLow(2)}
              />
              <img
                src={this.state.priceLowHover >= 3 ? DollarSelected : Dollar}
                alt="3 and above"
                onMouseEnter={() => {
                  this.setState({ priceLowHover: 3 });
                }}
                onMouseOut={() => {
                  this.setState({ priceLowHover: this.state.priceLow });
                }}
                onClick={() => this.setPriceLow(3)}
              />
              <img
                src={this.state.priceLowHover >= 4 ? DollarSelected : Dollar}
                alt="4 and above"
                onMouseEnter={() => {
                  this.setState({ priceLowHover: 4 });
                }}
                onMouseOut={() => {
                  this.setState({ priceLowHover: this.state.priceLow });
                }}
                onClick={() => this.setPriceLow(4)}
              />
              <img
                src={this.state.priceLowHover >= 5 ? DollarSelected : Dollar}
                alt="5 and above"
                onMouseEnter={() => {
                  this.setState({ priceLowHover: 5 });
                }}
                onMouseOut={() => {
                  this.setState({ priceLowHover: this.state.priceLow });
                }}
                onClick={() => this.setPriceLow(5)}
              />
              <h5>Maximum price</h5>
              <img
                src={this.state.priceHighHover >= 1 ? DollarSelected : Dollar}
                alt="1 and above"
                onMouseEnter={() => {
                  this.setState({ priceHighHover: 1 });
                }}
                onMouseOut={() => {
                  this.setState({ priceHighHover: this.state.priceHigh });
                }}
                onClick={() => this.setPriceHigh(1)}
              />
              <img
                src={this.state.priceHighHover >= 2 ? DollarSelected : Dollar}
                alt="2 and above"
                onMouseEnter={() => {
                  this.setState({ priceHighHover: 2 });
                }}
                onMouseOut={() => {
                  this.setState({ priceHighHover: this.state.priceHigh });
                }}
                onClick={() => this.setPriceHigh(2)}
              />
              <img
                src={this.state.priceHighHover >= 3 ? DollarSelected : Dollar}
                alt="3 and above"
                onMouseEnter={() => {
                  this.setState({ priceHighHover: 3 });
                }}
                onMouseOut={() => {
                  this.setState({ priceHighHover: this.state.priceHigh });
                }}
                onClick={() => this.setPriceHigh(3)}
              />
              <img
                src={this.state.priceHighHover >= 4 ? DollarSelected : Dollar}
                alt="4 and above"
                onMouseEnter={() => {
                  this.setState({ priceHighHover: 4 });
                }}
                onMouseOut={() => {
                  this.setState({ priceHighHover: this.state.priceHigh });
                }}
                onClick={() => this.setPriceHigh(4)}
              />
              <img
                src={this.state.priceHighHover >= 5 ? DollarSelected : Dollar}
                alt="5 and above"
                onMouseEnter={() => {
                  this.setState({ priceHighHover: 5 });
                }}
                onMouseOut={() => {
                  this.setState({ priceHighHover: this.state.priceHigh });
                }}
                onClick={() => this.setPriceHigh(5)}
              />
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
                {this.state.restaurants.length > 0 ? (
                  this.restaurantList()
                ) : (
                  <p style={{ paddingLeft: 20 }}>
                    Sorry, we couldn't find any restaurants! Please broaden your
                    search criteria and try again.
                  </p>
                )}
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
