//Import libraries
import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

//Import components
import Navbar from "../../components/nav/Navbar";
import MenuItemComponent from "../../components/restaurant/menuitem-component.js";
import GetLogin from "../../utils/GetLogin";
import Footer from "../footer/Footer";

//Import assets
import DisplayPrice from "../../assets/displayprice/DisplayPrice";
import DisplayRating from "../../assets/displayrating/DisplayRating";
import RestaurantImagePlaceholder from "./restaurantimageplaceholder.png";
import Loader from "../../assets/loader/Loader";

//Import stylesheet
import "./Restaurant.css";

export default class Restaurant extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    //Search the URL for an ID, then store it as a state variable
    const query = new URLSearchParams(this.props.location.search);
    const id = query.get("id");

    this.state = {
      isPageLoaded: false,
      id: id,
      menuItems: [],
      restaurant: [],
    };
  }

  //Get the restaurant data and the menu item associated with the restaurant
  componentDidMount() {
    this._isMounted = true;

    if (this.state.id !== "") {
      axios
        .get("/api/restaurants/" + this.state.id)
        .then((response) => {
          this.setState({
            restaurant: response.data,
            isPageLoaded: true,
          });
        })
        .catch(() => {
          this.setState({ restaurant: null, isPageLoaded: true });
        });
    } else {
      this.setState({ restaurant: null, isPageLoaded: true });
    }

    axios
      .get("/api/menuitems/" + this.state.id)
      .then((response) => {
        this.setState({ menuItems: response.data });
      })
      .catch(() => {
        this.setState({ menuItems: null });
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

  //This method returns a menu item for each menu item associated with the restaurant.
  getMenuItems = () => {
    if (this.state.menuItems) {
      return this.state.menuItems.map((currentMenuItem) => {
        return (
          <MenuItemComponent
            menuItem={currentMenuItem}
            key={currentMenuItem._id}
          />
        );
      });
    } else {
      return <Loader />;
    }
  };

  render() {
    if (this.state.isPageLoaded && this.state.isUserLoaded) {
      if (this.state.restaurant) {
        return (
          <div>
            <Navbar user={this.state.user} />
            <div className="RestaurantContainer">
              <div className="RestaurantTitleContainer">
                <img
                  src={"https://mealtimebucket.s3-us-west-1.amazonaws.com/" + this.state.restaurant._id + "/small.png"}
                  className="RestaurantImage"
                  alt={RestaurantImagePlaceholder}
                />
                <h2 className="RestaurantName">{this.state.restaurant.name}</h2>
              </div>
              <hr />
              <div className="RestaurantFlexContainer">
                <div className="RestaurantRating">
                  <DisplayRating rating={this.state.restaurant.rating} />
                </div>
                <div className="RestaurantPrice">
                  <DisplayPrice price={this.state.restaurant.price} />
                </div>
                <div className="RestaurantDistance">xx.xx miles</div>
              </div>
            </div>
            <div className="RestaurantItemContainer">
              <div className="RestaurantContainer">
                <div className="RestaurantFilters">
                  <h4>All Items</h4>
                </div>
                <div className="RestaurantMenuCollection">
                  {this.getMenuItems()}
                </div>
              </div>
            </div>
            <Footer />
          </div>
        );
      } else {
        return (
          <div>
            <Navbar user={this.state.user} />
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
      return <Loader />;
    }
  }
}
