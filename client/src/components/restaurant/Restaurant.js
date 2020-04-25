//Import libraries
import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";

//Import components
import Navbar from "../../components/nav/Navbar";
import MenuItemComponent from "../../components/restaurant/menuitem-component.js";
import GetLogin from "../../utils/GetLogin";
import Footer from "../footer/Footer";
import MenuItemOverlay from "./menuitemoverlay";

//Import utilities
import { GetRestaurantByID } from "../../utils/axios/Restaurants";
import { GetMenuItemsByRestaurantID } from "../../utils/axios/MenuItems";

//Import assets
import DisplayPrice from "../../assets/displayprice/DisplayPrice";
import DisplayRating from "../../assets/displayrating/DisplayRating";
import RestaurantImagePlaceholder from "./restaurantimageplaceholder.png";
import Loader from "../../assets/loader/Loader";

//Import utilities
import { getFromStorage } from "../../utils/storage";

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
      menuItemsInBag: [],
      menuItemsInBagLoaded: false,
      restaurantInBag: [],
      restaurantInBagLoaded: false,
    };
  }

  //Get the restaurant data and the menu item associated with the restaurant
  componentDidMount() {
    this._isMounted = true;

    if (this.state.id !== "") {
      GetRestaurantByID(this.state.id)
        .then((response) => {
          if (this._isMounted) {
            this.setState({
              restaurant: response.data,
              isPageLoaded: true,
            });
          }
        })
        .catch(() => {
          if (this._isMounted) {
            this.setState({
              restaurant: null,
              isPageLoaded: true,
            });
          }
        });
    } else {
      if (this._isMounted) {
        this.setState({
          restaurant: null,
          isPageLoaded: true,
        });
      }
    }

    GetMenuItemsByRestaurantID(this.state.id)
      .then((response) => {
        const groupedByCategory = _.groupBy(
          response.data,
          (menuitem) => menuitem.category
        );
        if (this._isMounted) {
          this.setState({
            menuItems: groupedByCategory,
          });
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            menuItems: null,
          });
        }
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

    //Initialize the value of menuItemsInBag to whatever is in storage
    let menuItemArray = getFromStorage("shoppingbag");
    if (menuItemArray !== null) {
      if (this._isMounted) {
        this.setState({
          menuItemsInBag: menuItemArray.menuItems,
          menuItemsInBagLoaded: true,
        });
      }
    } else {
      if (this._isMounted) {
        this.setState({
          menuItemsInBagLoaded: true,
        });
      }
    }

    //Initialize the value of restaurantInBag to whatever is in storage
    let restaurantInBagArray = getFromStorage("restaurant");
    if (restaurantInBagArray !== null) {
      if (this._isMounted) {
        this.setState({
          restaurantInBag: restaurantInBagArray,
          restaurantInBagLoaded: true,
        });
      }
    } else {
      if (this._isMounted) {
        this.setState({
          restaurantInBagLoaded: true,
        });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    document.body.style.overflow = "unset";
  }

  //This method resets itemSelection and itemSelectionMade. Passed as a prop to MenuItemOverlay
  cancelPopUp = () => {
    document.body.style.overflow = "unset";
    if (this._isMounted) {
      this.setState({
        itemSelection: [],
        itemSelectionMade: false,
      });
    }
  };

  //The method sets itemSelection and itemSelectionMade. Used to render MenuItemOverlay
  renderPopUp = (menuitem) => {
    document.body.style.overflow = "hidden";
    if (this._isMounted) {
      this.setState({
        itemSelection: menuitem,
        itemSelectionMade: true,
      });
    }
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

  //This updates the bag to include the menuitem added in the
  //menuitemoverlay component
  addToBag = (menuItems) => {
    if (this._isMounted) {
      this.setState({
        menuItemsInBag: menuItems,
      });
    }
  };

  //This updates the bag to include the restaurant added in the
  //menuitemoverlay component
  addRestaurantToBag = (restaurant) => {
    if (this._isMounted) {
      this.setState({
        restaurantInBag: restaurant,
      });
    }
  };

  //This method memoves a menuitem from the bag and resets restaurantInBag
  //If there are no more menuItems in the bag
  removeMenuItem = (index) => {
    let menuItems = this.state.menuItemsInBag;
    menuItems.splice(index, 1);
    if (this._isMounted) {
      this.setState({
        menuItemsInBag: menuItems,
      });
    }

    if (menuItems.length === 0 && this._isMounted) {
      this.setState({
        restaurantInBag: [],
      });
    }
  };

  render() {
    const {
      isPageLoaded,
      user,
      isUserLoaded,
      menuItemsInBag,
      menuItemsInBagLoaded,
      restaurantInBag,
      restaurantInBagLoaded,
      restaurant,
      itemSelectionMade,
      itemSelection,
    } = this.state;

    if (
      isPageLoaded &&
      isUserLoaded &&
      menuItemsInBagLoaded &&
      restaurantInBagLoaded
    ) {
      if (restaurant) {
        return (
          <div>
            {itemSelectionMade && (
              <MenuItemOverlay
                menuItem={itemSelection}
                cancelPopUp={this.cancelPopUp}
                addToBag={this.addToBag}
                addRestaurantToBag={this.addRestaurantToBag}
                restaurant={restaurant}
              />
            )}
            <Navbar
              user={user}
              menuItems={menuItemsInBag}
              restaurant={restaurantInBag}
              removeMenuItem={this.removeMenuItem}
            />
            <div className="RestaurantContainer">
              <div className="RestaurantTitleContainer">
                <img
                  src={
                    "https://mealtimebucket.s3-us-west-1.amazonaws.com/" +
                    restaurant._id +
                    "/small.png"
                  }
                  onError={(e) => {
                    e.target.setAttribute("src", RestaurantImagePlaceholder);
                    e.target.onerror = null;
                  }}
                  className="RestaurantImage"
                  alt=""
                />
                <h2 className="RestaurantName">{restaurant.name}</h2>
                <h5>{restaurant.address}</h5>
              </div>
              <DisplayRating rating={restaurant.rating} />
              <br />
              <DisplayPrice price={restaurant.price} />
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
            <Navbar
              user={user}
              menuItems={menuItemsInBag}
              restaurant={restaurantInBag}
              removeMenuItem={this.removeMenuItem}
            />
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
