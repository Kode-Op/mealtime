//Import libraries
import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import _ from "lodash";

//Import components
import Navbar from "../../components/nav/Navbar";
import MenuItemComponent from "../../components/restaurant/menuitem-component.js";
import GetLogin from "../../utils/GetLogin";
import Footer from "../footer/Footer";
import MenuItemOverlay from "./menuitemoverlay";

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
      itemSelection: [],
      itemSelectionMade: false,
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
        const groupedByCategory = _.groupBy(
          response.data,
          (menuitem) => menuitem.category
        );
        this.setState({ menuItems: groupedByCategory });
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

  cancelPopUp = () => {
    this.setState({
      itemSelection: [],
      itemSelectionMade: false,
    });
  };

  renderPopUp = (menuitem) => {
    this.setState({
      itemSelection: menuitem,
      itemSelectionMade: true,
    });
  };

  //This method return each menu item associated with a particular category.
  getMenuItems = (categoryArray) => {
    return categoryArray.map((currentMenuItem) => {
      return (
        <MenuItemComponent
          key={currentMenuItem._id}
          menuItem={currentMenuItem}
          renderPopUp={this.renderPopUp}
        />
      );
    });
  };

  //This method returns each category associated with the restaurant
  getMenuItemCategories = () => {
    if (this.state.menuItems) {
      return Object.entries(this.state.menuItems).map((key) => {
        return (
          <div key={key[0] + " div"} style={{ width: "100%" }}>
            <div className="RestaurantFilters" key={key[0]}>
              <h4 style={{ fontWeight: "bold" }}>{key[0]}</h4>
            </div>
            {this.getMenuItems(key[1])}
          </div>
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
            {this.state.itemSelectionMade && (
              <MenuItemOverlay
                menuItem={this.state.itemSelection}
                cancelPopUp={this.cancelPopUp}
              />
            )}
            <Navbar user={this.state.user} />
            <div className="RestaurantContainer">
              <div className="RestaurantTitleContainer">
                <img
                  src={
                    "https://mealtimebucket.s3-us-west-1.amazonaws.com/" +
                    this.state.restaurant._id +
                    "/small.png"
                  }
                  onError={(e) => {
                    e.target.setAttribute("src", RestaurantImagePlaceholder);
                    e.target.onerror = null;
                  }}
                  className="RestaurantImage"
                  alt=""
                />
                <h2 className="RestaurantName">{this.state.restaurant.name}</h2>
                <h5>{this.state.restaurant.address}</h5>
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
                <div className="RestaurantMenuCollection">
                  {this.getMenuItemCategories()}
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
