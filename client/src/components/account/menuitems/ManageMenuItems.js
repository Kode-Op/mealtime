//Import libraries
import React, { Component } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import axios from "axios";
import _ from "lodash";

//Import assets
import Loader from "../../../assets/loader/Loader";

//Import stylesheets
import "./ManageMenuItems.css";

export default class ManageMenuItems extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      restaurants: [],
      areRestaurantsLoaded: false,
      restaurantSelectionMade: false,
      menuItems: [],
      areMenuItemsLoaded: false,
      restaurantID: "",
      additionalCategories: [],

      //Default menu item values
      name: "",
      price: "$0.00",
      preptime: 0,
      description: "",
      category: "",
      errorMessage: "",
      successMessage: "",
    };
  }
  componentDidMount() {
    this._isMounted = true;

    //Load the restaurant data associated with the user that is logged in.
    axios
      .get("/api/restaurants/byOwner/" + this.props.user._id)
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
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onChangeName = (e) => {
    e.preventDefault();
    this.setState({
      name: e.target.value,
    });
  };
  onChangePrice = (e) => {
    e.preventDefault();
    this.setState({
      price: e.target.value,
    });
  };
  onChangePrepTime = (e) => {
    e.preventDefault();
    this.setState({
      preptime: e.target.value,
    });
  };
  onChangeCategory = (e) => {
    e.preventDefault();
    this.setState({
      category: e.target.value,
    });
  };
  onChangeDescription = (e) => {
    e.preventDefault();
    this.setState({
      description: e.target.value,
    });
  };

  getForm = (category, id) => {
    return (
      <React.Fragment>
        <label htmlFor="name" className="ProfileFormTest">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={this.state.name}
          onChange={this.onChangeName}
          className="ProfileInputBox"
          required
        />
        <label htmlFor="price" className="ProfileFormTest">
          Price (Must be in the format $xx.xx)
        </label>
        <input
          type="text"
          name="price"
          value={this.state.price}
          onChange={this.onChangePrice}
          className="ProfileInputBox"
          required
        />
        <label htmlFor="preptime" className="ProfileFormTest">
          Average preptime (in minutes)
        </label>
        <input
          type="text"
          name="preptime"
          value={this.state.preptime}
          onChange={this.onChangePrepTime}
          className="ProfileInputBox"
          required
        />
        <label htmlFor="category" className="ProfileFormTest">
          Category
        </label>
        <select
          id={id + " " + category}
          value={this.state.category}
          onChange={this.onChangeCategory}
          className="ProfileInputBox"
        >
          {this.getCategories(id)}
          {this.getAdditionalCategories(id)}
        </select>
        <label htmlFor="description" className="ProfileFormTest">
          Description
        </label>
        <textarea
          id={id + " " + category + " description"}
          value={this.state.description}
          onChange={this.onChangeDescription}
          className="ManageRestaurantTextArea"
          required
        />
        <div className="ProfileErrorMessage">{this.state.errorMessage}</div>
        <div className="ProfileSuccessMessage">{this.state.successMessage}</div>
      </React.Fragment>
    );
  };

  getCategories = (id) => {
    return Object.entries(this.state.menuItems).map((key) => {
      return (
        <option key={id + " " + key[0]} value={key[0]}>
          {key[0]}
        </option>
      );
    });
  };

  getAdditionalCategories = (id) => {
    return this.state.additionalCategories.map((currentCategory) => {
      return (
        <option key={id + " " + currentCategory} value={currentCategory}>
          {currentCategory}
        </option>
      );
    });
  };

  getRestaurantMenuItems = (e) => {
    if (e.target.value !== "0") {
      let restaurantID = e.target.value;
      this.setState({ restaurantSelectionMade: true });
      axios
        .get("/api/menuitems/" + e.target.value)
        .then((response) => {
          const groupedByCategory = _.groupBy(
            response.data,
            (menuitem) => menuitem.category
          );
          this.setState({
            restaurantID: restaurantID,
            menuItems: groupedByCategory,
            areMenuItemsLoaded: true,
          });
        })
        .catch((error) => {
          this.setState({
            menuItems: null,
            areMenuItemsLoaded: true,
          });
          console.log(error);
        });
    } else {
      this.setState({
        restaurantSelectionMade: false,
        areMenuItemsLoaded: false,
      });
    }
  };

  getRestaurantSelection = () => {
    return this.state.restaurants.map((currentRestaurant) => {
      return (
        <option key={currentRestaurant._id} value={currentRestaurant._id}>
          {currentRestaurant.name + " - " + currentRestaurant.address}
        </option>
      );
    });
  };

  updateStateVals = (menuitem) => {
    let price = menuitem.price / 100;
    price.toLocaleString("en-US", { style: "currency", currency: "USD" });
    price = "$" + price;

    this.setState({
      name: menuitem.name,
      price: price,
      preptime: menuitem.preptime,
      category: menuitem.category,
      description: menuitem.description,
      errorMessage: "",
      successMessage: "",
    });
  };

  resetStateVals = (category) => {
    this.setState({
      name: "",
      price: "$0.00",
      preptime: 0,
      category: category,
      description: "",
      errorMessage: "",
      successMessage: "",
    });
  };

  validateForm = () => {
    //Regular expression courtesy of https://stackoverflow.com/questions/8829765/regular-expression-for-dollar-amount-in-javascript
    const priceVerification = /^\$?[0-9]+(\.[0-9][0-9])?$/;
    let errorMessage = "";

    if (!priceVerification.test(this.state.price)) {
      errorMessage = errorMessage.concat(
        "The price must be in the format $xx.xx \n"
      );
    }

    if (isNaN(this.state.preptime)) {
      errorMessage = errorMessage.concat(
        "Your preptime must only contain numbers.\n"
      );
    }
    if (errorMessage) {
      this.setState({ errorMessage: errorMessage });
      return false;
    }
    return true;
  };

  //This method turns "$xxx.yy" into an integer xxxyy
  parsePrice = (priceString) => {
    let stringArr = priceString.split(".");
    let dollars = stringArr[0].match(/\d/g);
    dollars = dollars.join("");
    let cents;
    if (stringArr[1]) {
      cents = stringArr[1].match(/\d/g);
      cents = cents.join("");
    } else {
      cents = 0;
    }
    return parseInt(dollars, 10) * 100 + parseInt(cents, 10);
  };

  onAddMenuItem = (e) => {
    e.preventDefault();
    if (this.validateForm()) {
      let pkg = {
        restaurantId: this.state.restaurantID,
        name: this.state.name,
        price: this.parsePrice(this.state.price),
        preptime: parseInt(this.state.preptime, 10),
        description: this.state.description,
        category: this.state.category,
      };

      console.log(pkg);
      axios
        .post("/api/menuItems/add/", pkg)
        .then(() => {
          this.setState({
            successMessage: "Successfully added menu item!",
            errorMessage: "",
          });
          window.location.reload(true);
        })
        .catch((error) => {
          this.setState({
            errorMessage:
              "An unxpected error has occurred. Please try again later.",
            successMessage: "",
          });
          console.log(error);
        });
    }
  };

  onUpdateMenuItem = (e, id) => {
    e.preventDefault();
    if (this.validateForm()) {
      let pkg = {
        name: this.state.name,
        price: this.parsePrice(this.state.price),
        preptime: parseInt(this.state.preptime, 10),
        category: this.state.category,
        description: this.state.description,
      };

      console.log(pkg);
      axios
        .post("/api/menuItems/update/" + id, pkg)
        .then(() => {
          this.setState({
            successMessage: "Successfully edited menu item!",
            errorMessage: "",
          });
          window.location.reload(true);
        })
        .catch((error) => {
          this.setState({
            errorMessage:
              "An unxpected error has occurred. Please try again later.",
            successMessage: "",
          });
          console.log(error);
        });
    }
  };

  onDeleteMenuItem = (e, id) => {
    e.preventDefault();
    if (
      window.confirm(
        "WARNING: This will delete your menu item.\nAre you sure you want to do this?"
      )
    ) {
      axios
        .delete("/api/menuItems/" + id)
        .then(() => {
          this.setState({
            successMessage: "Successfully deleted menu item",
            errorMessage: "",
          });
          window.location.reload(true);
        })
        .catch((error) => {
          this.setState({
            errorMessage:
              "An unxpected error has occurred. Please try again later.",
            successMessage: "",
          });
          console.log(error);
        });
    }
  };

  onAddCategory = () => {
    let categoryName = prompt(
      "Please enter the name of the category you would like to add."
    );
    if (categoryName !== "" && categoryName !== null) {
      let additionalCategories = this.state.additionalCategories;
      additionalCategories.unshift(categoryName);
      this.setState({ additionalCategories });
    }
  };

  renderMenuItems(category, menuItemArray) {
    return menuItemArray.map((currentMenuItem) => {
      return (
        <Card key={currentMenuItem._id}>
          <Accordion.Toggle
            as={Card.Header}
            onClick={() => this.updateStateVals(currentMenuItem)}
            eventKey={currentMenuItem._id}
            style={{ cursor: "pointer" }}
          >
            <div
              style={{
                display: "inline",
                fontWeight: "bold",
                paddingRight: 10,
              }}
            >
              {currentMenuItem.name}
              <div className="ProfileEditLink" style={{ fontWeight: "normal" }}>
                Edit
              </div>
            </div>
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                paddingRight: 160,
                fontSize: "0.8em",
                textOverflow: "ellipsis",
              }}
            >
              {currentMenuItem.description}
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={currentMenuItem._id}>
            <Card.Body>
              <form
                onSubmit={(e) => this.onUpdateMenuItem(e, currentMenuItem._id)}
              >
                {this.getForm(category, currentMenuItem._id)}
                <Button variant="success" type="submit">
                  Update menu item
                </Button>
                <Button
                  variant="danger"
                  onClick={(e) => this.onDeleteMenuItem(e, currentMenuItem._id)}
                  style={{ marginLeft: 30 }}
                >
                  Delete menu item
                </Button>
              </form>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      );
    });
  }

  renderAdditionalMenuItemGroups = () => {
    if (this.state.restaurantSelectionMade && this.state.areMenuItemsLoaded) {
      return this.state.additionalCategories.map((currentCategory) => {
        return (
          <div key={currentCategory + " div"}>
            <h2 key={currentCategory} style={{ paddingTop: 30 }}>
              {currentCategory}
            </h2>
            <Card key={currentCategory + " card"}>
              <Accordion.Toggle
                as={Card.Header}
                onClick={() => this.resetStateVals(currentCategory)}
                eventKey={currentCategory + " add"}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    display: "inline",
                    fontWeight: "bold",
                    paddingRight: 10,
                  }}
                >
                  Add Menu Item+
                  <div
                    className="ProfileEditLink"
                    style={{ fontWeight: "normal" }}
                  >
                    Add
                  </div>
                </div>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={currentCategory + " add"}>
                <Card.Body>
                  <form onSubmit={(e) => this.onAddMenuItem(e)}>
                    {this.getForm(currentCategory, 0)}
                    <Button variant="success" type="submit">
                      Add menu item
                    </Button>
                  </form>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </div>
        );
      });
    } else {
      return <div></div>;
    }
  };

  renderMenuItemGroups = () => {
    if (this.state.restaurantSelectionMade) {
      if (this.state.areMenuItemsLoaded) {
        return Object.entries(this.state.menuItems).map((key) => {
          return (
            <div key={key[0] + " div"}>
              <h2 key={key[0]} style={{ paddingTop: 30 }}>
                {key[0]}
              </h2>
              {this.renderMenuItems(key[0], key[1])}
              <Card key={key[0] + " card"}>
                <Accordion.Toggle
                  as={Card.Header}
                  onClick={() => this.resetStateVals(key[0])}
                  eventKey={key[0] + " add"}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "inline",
                      fontWeight: "bold",
                      paddingRight: 10,
                    }}
                  >
                    Add Menu Item+
                    <div
                      className="ProfileEditLink"
                      style={{ fontWeight: "normal" }}
                    >
                      Add
                    </div>
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={key[0] + " add"}>
                  <Card.Body>
                    <form onSubmit={(e) => this.onAddMenuItem(e)}>
                      {this.getForm(key[0], 0)}
                      <Button variant="success" type="submit">
                        Add menu item
                      </Button>
                    </form>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </div>
          );
        });
      } else {
        return <Loader />;
      }
    } else {
      return <div></div>;
    }
  };

  render() {
    if (this.state.areRestaurantsLoaded) {
      if (this.state.restaurants.length > 0) {
        return (
          <div>
            <h2>Please select a restaurant</h2>
            <div style={{ display: "flex" }}>
              <select
                id="0"
                onChange={this.getRestaurantMenuItems}
                className="ManageRestaurantInputBox"
                style={{ marginBottom: -20 }}
              >
                <option value="0"></option>
                {this.getRestaurantSelection()}
              </select>

              {this.state.areMenuItemsLoaded && (
                <Button
                  style={{ width: 150, marginLeft: 20 }}
                  onClick={() => this.onAddCategory()}
                >
                  Add Category
                </Button>
              )}
            </div>
            {console.log(this.state.menuItems)}
            {console.log(Object.keys(this.state.menuItems).length === 0)}
            {this.state.areMenuItemsLoaded &&
              this.state.additionalCategories.length === 0 &&
              Object.keys(this.state.menuItems).length === 0 && (
                <div style={{ marginTop: 30 }}>
                  <h2>To add a menu item, click "Add Category" to start!</h2>
                </div>
              )}
            <Accordion>
              {this.renderAdditionalMenuItemGroups()}
              {this.renderMenuItemGroups()}
            </Accordion>
          </div>
        );
      } else {
        return (
          <div style={{ marginTop: 10 }}>
            <h2>It looks like you don't have any restaurants yet!</h2>
            <p>Click "Manage Restaurants" to add a restaurant first.</p>
          </div>
        );
      }
    } else {
      return <Loader />;
    }
  }
}
