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
import Star from "../../assets/images/restaurantlist/star.png";
import StarSelected from "../../assets/images/restaurantlist/starselected.png";
import Dollar from "../../assets/images/restaurantlist/dollar.png";
import DollarSelected from "../../assets/images/restaurantlist/dollarselected.png";

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
            if (this._isMounted) {
              this.setState({
                restaurants: response.data,
                areRestaurantsLoaded: true,
              });
            }
          })
          .catch(() => {
            if (this._isMounted) {
              this.setState({
                areRestaurantsLoaded: true,
              });
            }
          });
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //This method obtains restaurants and sets them in the state
  renderRestaurants = (appliedFilters, rating, priceLow, priceHigh) => {
    const pkg = {
      userId: this.state.user ? this.state.user._id : null,
      tags: appliedFilters,
      ratings: rating * 2,
      priceLow: priceLow,
      priceHigh: priceHigh,
    };

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
          this.setState({
            areRestaurantsLoaded: true,
          });
        }
      });
  };

  //This method renders each restaurant in the state
  restaurantList = () => {
    const { areRestaurantsLoaded, restaurants } = this.state;

    if (areRestaurantsLoaded) {
      if (restaurants.length > 0) {
        return restaurants.map((currentRestaurant) => {
          return (
            <RestaurantListComponent
              restaurant={currentRestaurant}
              key={currentRestaurant._id}
            />
          );
        });
      } else {
        return (
          <p style={{ paddingLeft: 20, paddingTop: 20 }}>
            Sorry, we couldn't find any restaurants! Please broaden your search
            criteria and try again.
          </p>
        );
      }
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

  //Returns 1-5 dollar signs based on the integer passed as an argument.
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

  //Renders the applied filters
  getAppliedFilters = () => {
    const {
      starSelected,
      priceLow,
      priceHigh,
      appliedFilters,
      tags,
    } = this.state;

    let rows = [];

    //Renders the minimum rating filter.
    if (starSelected > 0) {
      rows.push(
        <div
          className="RestaurantListAppliedFilter"
          onClick={() => this.setRating(starSelected)} //Setting a rating equal to itself emulates undoing the filter
        >
          <div style={{ margin: "0 auto" }}>
            {starSelected}
            {starSelected !== 5 ? "+" : ""} stars
          </div>
        </div>
      );
    }

    //Renders the price filter
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
    const { appliedFilters, starSelected, priceLow, priceHigh } = this.state;

    let filters = appliedFilters;

    //Only add the filter if it's not already applied.
    if (filters.indexOf(i) === -1) {
      filters.push(i);
      this.setState({ appliedFilters: filters });

      //Rerender the restaurants
      this.renderRestaurants(filters, starSelected, priceLow, priceHigh);
    }
  };

  //This method removes a filter from this.state.appliedFilters
  removeFilter = (i) => {
    const { appliedFilters, starSelected, priceLow, priceHigh } = this.state;

    let filters = appliedFilters;

    filters.splice(i, 1);
    this.setState({ appliedFilters: filters });

    //Rerender the restaurants
    this.renderRestaurants(filters, starSelected, priceLow, priceHigh);
  };

  //Resets the minimum and maximum price to its default values
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

  //Sets the rating filter and rerenders the restaurants
  setRating = (rating) => {
    const { starSelected, appliedFilters, priceLow, priceHigh } = this.state;

    //Only set the rating if it's not already set. Otherwise, reset to default.
    if (rating !== starSelected) {
      this.setState({
        starSelected: rating,
      });
    } else {
      this.setState({
        starSelected: 0,
        starHover: 0,
      });
      rating = 0;
    }

    //Rerender the restaurants
    this.renderRestaurants(appliedFilters, rating, priceLow, priceHigh);
  };

  //Sets the minimum price filter and rerenders the restaurants
  setPriceLow = (price) => {
    const { appliedFilters, starSelected, priceLow, priceHigh } = this.state;

    if (price !== priceLow) {
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

    let priceHighNew = priceHigh;
    if (price > priceHigh) {
      this.setState({
        priceHigh: price,
        priceHighHover: price,
      });
      priceHighNew = price;
    }

    this.renderRestaurants(appliedFilters, starSelected, price, priceHighNew);
  };

  //Sets the maximum price filter and rerenders the restaurants
  setPriceHigh = (price) => {
    const { appliedFilters, starSelected, priceLow, priceHigh } = this.state;

    if (price !== priceHigh) {
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

    let priceLowNew = priceLow;
    if (price < priceLow) {
      this.setState({
        priceLow: price,
        priceLowHover: price,
      });
      priceLowNew = price;
    }
    this.renderRestaurants(appliedFilters, starSelected, priceLowNew, price);
  };

  render() {
    const {
      user,
      isUserLoaded,
      starHover,
      starSelected,
      priceLowHover,
      priceLow,
      priceHighHover,
      priceHigh,
    } = this.state;

    if (isUserLoaded) {
      return (
        <div>
          <div className="RestaurantListContainer">
            <Navbar user={user} />
            <div className="RestaurantListLeftPane">
              <h4>Filters</h4>
              <h5>Rating</h5>
              <img
                src={starHover >= 1 ? StarSelected : Star}
                alt="1 and above"
                onMouseEnter={() => {
                  this.setState({ starHover: 1 });
                }}
                onMouseOut={() => {
                  this.setState({ starHover: starSelected });
                }}
                onClick={() => this.setRating(1)}
              />
              <img
                src={starHover >= 2 ? StarSelected : Star}
                alt="2 and above"
                onMouseEnter={() => {
                  this.setState({ starHover: 2 });
                }}
                onMouseOut={() => {
                  this.setState({ starHover: starSelected });
                }}
                onClick={() => this.setRating(2)}
              />
              <img
                src={starHover >= 3 ? StarSelected : Star}
                alt="3 and above"
                onMouseEnter={() => {
                  this.setState({ starHover: 3 });
                }}
                onMouseOut={() => {
                  this.setState({ starHover: starSelected });
                }}
                onClick={() => this.setRating(3)}
              />
              <img
                src={starHover >= 4 ? StarSelected : Star}
                alt="4 and above"
                onMouseEnter={() => {
                  this.setState({ starHover: 4 });
                }}
                onMouseOut={() => {
                  this.setState({ starHover: starSelected });
                }}
                onClick={() => this.setRating(4)}
              />
              <img
                src={starHover >= 5 ? StarSelected : Star}
                alt="5 and above"
                onMouseEnter={() => {
                  this.setState({ starHover: 5 });
                }}
                onMouseOut={() => {
                  this.setState({ starHover: starSelected });
                }}
                onClick={() => this.setRating(5)}
              />
              <h5>Minimum price</h5>
              <img
                src={priceLowHover >= 1 ? DollarSelected : Dollar}
                alt="1 and above"
                onMouseEnter={() => {
                  this.setState({ priceLowHover: 1 });
                }}
                onMouseOut={() => {
                  this.setState({ priceLowHover: priceLow });
                }}
                onClick={() => this.setPriceLow(1)}
              />
              <img
                src={priceLowHover >= 2 ? DollarSelected : Dollar}
                alt="2 and above"
                onMouseEnter={() => {
                  this.setState({ priceLowHover: 2 });
                }}
                onMouseOut={() => {
                  this.setState({ priceLowHover: priceLow });
                }}
                onClick={() => this.setPriceLow(2)}
              />
              <img
                src={priceLowHover >= 3 ? DollarSelected : Dollar}
                alt="3 and above"
                onMouseEnter={() => {
                  this.setState({ priceLowHover: 3 });
                }}
                onMouseOut={() => {
                  this.setState({ priceLowHover: priceLow });
                }}
                onClick={() => this.setPriceLow(3)}
              />
              <img
                src={priceLowHover >= 4 ? DollarSelected : Dollar}
                alt="4 and above"
                onMouseEnter={() => {
                  this.setState({ priceLowHover: 4 });
                }}
                onMouseOut={() => {
                  this.setState({ priceLowHover: priceLow });
                }}
                onClick={() => this.setPriceLow(4)}
              />
              <img
                src={priceLowHover >= 5 ? DollarSelected : Dollar}
                alt="5 and above"
                onMouseEnter={() => {
                  this.setState({ priceLowHover: 5 });
                }}
                onMouseOut={() => {
                  this.setState({ priceLowHover: priceLow });
                }}
                onClick={() => this.setPriceLow(5)}
              />
              <h5>Maximum price</h5>
              <img
                src={priceHighHover >= 1 ? DollarSelected : Dollar}
                alt="1 and above"
                onMouseEnter={() => {
                  this.setState({ priceHighHover: 1 });
                }}
                onMouseOut={() => {
                  this.setState({ priceHighHover: priceHigh });
                }}
                onClick={() => this.setPriceHigh(1)}
              />
              <img
                src={priceHighHover >= 2 ? DollarSelected : Dollar}
                alt="2 and above"
                onMouseEnter={() => {
                  this.setState({ priceHighHover: 2 });
                }}
                onMouseOut={() => {
                  this.setState({ priceHighHover: priceHigh });
                }}
                onClick={() => this.setPriceHigh(2)}
              />
              <img
                src={priceHighHover >= 3 ? DollarSelected : Dollar}
                alt="3 and above"
                onMouseEnter={() => {
                  this.setState({ priceHighHover: 3 });
                }}
                onMouseOut={() => {
                  this.setState({ priceHighHover: priceHigh });
                }}
                onClick={() => this.setPriceHigh(3)}
              />
              <img
                src={priceHighHover >= 4 ? DollarSelected : Dollar}
                alt="4 and above"
                onMouseEnter={() => {
                  this.setState({ priceHighHover: 4 });
                }}
                onMouseOut={() => {
                  this.setState({ priceHighHover: priceHigh });
                }}
                onClick={() => this.setPriceHigh(4)}
              />
              <img
                src={priceHighHover >= 5 ? DollarSelected : Dollar}
                alt="5 and above"
                onMouseEnter={() => {
                  this.setState({ priceHighHover: 5 });
                }}
                onMouseOut={() => {
                  this.setState({ priceHighHover: priceHigh });
                }}
                onClick={() => this.setPriceHigh(5)}
              />
              <div style={{ height: 50 }} /> {/*padding*/}
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
