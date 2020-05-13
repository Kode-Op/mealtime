//Import libraries
import React, { Component } from "react";
import {
  Navbar,
  Nav,
  Button,
  ButtonToolbar,
  NavDropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";

//Import assets
import ShoppingBagIcon from "../../assets/images/nav/shoppingbag.png";

//Import utilities
import { getFromStorage, setInStorage } from "../../utils/storage";

//Import stylesheets
import "./Navbar.css";

export default class NavBar extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      numMenuItems: 0,
      menuItems: [],
      getMenuItemsFromStorage: true,
      bagMenuToggle: false,
      disableToggle: false,
      restaurant: [],
    };

    if (window.innerWidth < 1024) {
      this.state = {
        mobileview: true,
      };
    } else {
      this.state = {
        mobileview: false,
      };
    }
  }

  componentDidMount() {
    this._isMounted = true;

    //If a prop is found, set getMenuItemsFromStorage to true. Otherwise,
    //set to false and initialize the menuitems state to whatever is in storage
    if (this.props.menuItems) {
      if (this._isMounted) {
        this.setState({
          getMenuItemsFromStorage: false,
        });
      }
    } else {
      let menuItemArray = getFromStorage("shoppingbag");
      let restaurant = getFromStorage("restaurant");
      if (this._isMounted) {
        this.setState({
          getMenuItemsFromStorage: true,
          restaurant: restaurant,
        });
      }
      if (menuItemArray) {
        if (this._isMounted) {
          this.setState({
            menuItems: menuItemArray.menuItems,
          });
        }
      } else {
        if (this._isMounted) {
          this.setState({
            menuItems: [],
          });
        }
      }
    }

    //Add an event lister to call getMobileView when the window is resized
    window.addEventListener("resize", this.getMobileView, false);
  }

  //Remove the event listeners when component unmounts
  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener("resize", this.getMobileView);
  }

  //This method sets mobileview to true if the window has
  //a width of less than 1024
  getMobileView = () => {
    if (this._isMounted) {
      if (window.innerWidth < 1024) {
        this.setState({ mobileview: true });
      } else {
        this.setState({ mobileview: false });
      }
    }

    console.log(this.state.mobileview);
  };

  //Whenever a new menu item is received from Restaurant.js, set 'bagMenuToggle' to true.
  //This automatically opens the bag icon in the navbar
  componentDidUpdate(prevProps) {
    if (prevProps.menuItems !== this.props.menuItems && this._isMounted) {
      this.setState({
        bagMenuToggle: true,
      });
    }
  }

  //Converts price integer 625, quantity integer 2 to "$12.50"
  convertToPrice = (quantity, price) => {
    return ((price * quantity) / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  //Removes a menu item from storage and sets "restaurant" to null if there
  //are no remaining menu items. If we're receiving props from Restaurant.js,
  //call the removeMenuItem handler as well to update the menuitem prop
  removeItem = (index) => {
    let menuItemArray = getFromStorage("shoppingbag");
    menuItemArray.menuItems.splice(index, 1);
    setInStorage("shoppingbag", menuItemArray);
    if (menuItemArray.menuItems.length === 0 && this._isMounted) {
      setInStorage("restaurant", null);
      this.setState({
        restaurant: [],
      });
    }

    if (this.state.getMenuItemsFromStorage) {
      if (this._isMounted) {
        this.setState({
          menuItems: menuItemArray.menuItems,
        });
      }
    } else {
      this.props.removeMenuItem(index);
    }
  };

  //Display each menu item in the cart
  getEachItem = (menuItems) => {
    return menuItems.map((currentMenuItem, index) => {
      const { quantity, time } = currentMenuItem;
      const { name, price, _id } = currentMenuItem.menuItem;

      return (
        <div key={_id + " " + time}>
          {quantity} x {name}
          <div style={{ float: "right" }}>
            {this.convertToPrice(quantity, price)}
            <div className="NavExit" onClick={() => this.removeItem(index)}>
              ✖
            </div>
          </div>
        </div>
      );
    });
  };

  //Adds up the quantity * price of all menu items. Returns an integer.
  getSubTotal = (menuItems) => {
    let subTotal = 0;
    menuItems.forEach((currentMenuItem) => {
      subTotal += currentMenuItem.quantity * currentMenuItem.menuItem.price;
    });
    return subTotal;
  };

  //Renders the contents of the box when clicking on the bag icon
  getItemsInBag = () => {
    let menuItems;
    let restaurant;

    if (this.state.getMenuItemsFromStorage) {
      menuItems = this.state.menuItems;
      restaurant = this.state.restaurant;
    } else {
      menuItems = this.props.menuItems;
      restaurant = this.props.restaurant;
    }
    if (!menuItems || menuItems.length === 0) {
      return (
        <div className="NavBag" style={{ color: "#999999" }}>
          You have nothing in your bag. Please add an item to make an order!
        </div>
      );
    } else {
      let subTotal = this.getSubTotal(menuItems);
      const minorder = restaurant.minorder;

      return (
        <div className="NavBag">
          <h5>Your order</h5>
          <hr />
          {this.getEachItem(menuItems)}
          <hr />
          Item subtotal:
          <div style={{ float: "right", paddingRight: 28 }}>
            {this.convertToPrice(1, subTotal)}
          </div>
          <hr />
          <Link to="/checkout">
            <Button
              variant={subTotal < minorder ? "secondary" : "success"}
              disabled={subTotal < minorder}
            >
              Proceed to checkout
            </Button>
          </Link>
          <div style={{ color: "grey", fontSize: "0.9em", paddingTop: 20 }}>
            {subTotal < minorder
              ? restaurant.name +
                " has a minimum checkout price of " +
                this.convertToPrice(1, minorder)
              : ""}
          </div>
        </div>
      );
    }
  };

  //Renders the number icon representing on top of the shopping bag.
  renderMenuItemLengthIcon = (topOffset, rightOffset) => {
    let menuItems;

    if (this.state.getMenuItemsFromStorage) {
      menuItems = this.state.menuItems;
    } else {
      menuItems = this.props.menuItems;
    }
    if (menuItems && menuItems.length > 0) {
      return (
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: "red",
            color: "white",
            position: "absolute",
            borderRadius: "50%",
            top: topOffset,
            right: rightOffset,
            fontSize: "0.8em",
          }}
        >
          {menuItems.length}
        </div>
      );
    }
  };

  //This method renders a navbar with different contents depending on whether
  //or not a user is logged in
  getLogin = () => {
    if (!this.props.user) {
      return (
        <React.Fragment>
          <Nav.Link as={Link} to="/">
            <div className="linkstyle" style={{ paddingTop: 0 }}>
              MealTime
            </div>
          </Nav.Link>
          <div className="navzone">
            <input
              type="text"
              name="address"
              className="navbox"
              placeholder="Enter your address..."
              style={{ color: "black" }}
            />
            <Link to="/search">
              <Button className="navgo" variant="danger">
                >
              </Button>
            </Link>
          </div>
          <Navbar.Collapse className="justify-content-end">
            <ButtonToolbar>
              <NavDropdown
                title={
                  <div style={{ display: "inline-block" }}>
                    <img
                      src={ShoppingBagIcon}
                      style={{
                        width: 25,
                        marginTop: 5,
                      }}
                      alt=""
                    />
                    {this.renderMenuItemLengthIcon(27, 23)}
                  </div>
                }
                alignRight
                onToggle={(isOpen) => {
                  this.setState({
                    bagMenuToggle: isOpen,
                  });
                }}
                show={
                  this.props.disableToggle ? false : this.state.bagMenuToggle
                }
              >
                {this.getItemsInBag()}
              </NavDropdown>
              <Nav.Link as={Link} to="/login">
                <div className="linkstyle">Log In</div>
              </Nav.Link>
              <Nav.Link as={Link} to="/register">
                <div className="registerbutton">Register</div>
              </Nav.Link>
            </ButtonToolbar>
          </Navbar.Collapse>
        </React.Fragment>
      );
    } else {
      const { isOwner, firstName, address } = this.props.user;
      return (
        <React.Fragment>
          <Nav.Link as={Link} to="/feed">
            <div className="linkstyle" style={{ paddingTop: 0 }}>
              MealTime
            </div>
          </Nav.Link>
          <div className="navzone">
            <input
              type="text"
              name="address"
              className="navbox"
              defaultValue={address}
              placeholder="Enter your address..."
            />
            <Link to="/search">
              <Button className="navgo" variant="danger">
                >
              </Button>
            </Link>
          </div>
          <Navbar.Collapse className="justify-content-end">
            <ButtonToolbar>
              <NavDropdown
                title={
                  <span style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                    Welcome, {firstName}!
                  </span>
                }
                id="nav-dropdown"
                alignRight
                className="NavSettingsTitle"
              >
                {isOwner && (
                  <NavDropdown.Item href="/manage/restaurants">
                    <div className="NavSettingsDropdown">
                      Manage Restaurants
                    </div>
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item href="/account/profile">
                  <div className="NavSettingsDropdown">Settings</div>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/logout">
                  <div className="NavLogoutDropdown">Logout</div>
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title={
                  <div style={{ display: "inline-block" }}>
                    <img
                      src={ShoppingBagIcon}
                      style={{
                        width: 25,
                        marginTop: -7,
                      }}
                      alt=""
                    />
                    {this.renderMenuItemLengthIcon(20, 23)}
                  </div>
                }
                alignRight
                onToggle={(isOpen) => {
                  this.setState({
                    bagMenuToggle: isOpen,
                  });
                }}
                show={
                  this.props.disableToggle ? false : this.state.bagMenuToggle
                }
              >
                {this.getItemsInBag()}
              </NavDropdown>
            </ButtonToolbar>
          </Navbar.Collapse>
        </React.Fragment>
      );
    }
  };

  render() {
    return (
      <div>
        <Navbar
          fixed={this.state.mobileview ? "" : "top"}
          style={{ backgroundColor: "#2b1d0e" }}
          className="navheader"
        >
          {this.getLogin()}
        </Navbar>
        <div className={this.state.mobileview ? "" : "navspacer"} />
        {this.state.mobileview && (
          <div
            style={{
              width: "100%",
              height: 80,
              padding: 20,
              backgroundColor: "#DDDDDD",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                margin: "0 auto",
              }}
            >
              <input
                type="text"
                name="address"
                className="navbox"
                defaultValue={this.props.user ? this.props.user.address : ""}
                placeholder="Enter your address..."
              />
              <Link to="/search">
                <Button className="navgo" variant="danger">
                  >
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}
