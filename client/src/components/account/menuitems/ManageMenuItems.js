//Import libraries
import React, { Component } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import _ from "lodash";

//Import assets
import Loader from "../../../assets/loader/Loader";

//Import stylesheets
import "./ManageMenuItems.css";

//Import Utils
import { GetRestaurantByUserID } from "../../../utils/axios/Restaurants";

import {
  GetMenuItemsByRestaurantID,
  AddMenuItem,
  UpdateMenuItem,
  DeleteMenuItem,
} from "../../../utils/axios/MenuItems";

import UploadFile from "../../../utils/axios/Files";

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
      thumbnail: null,
      largeImage: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    //Load the restaurant data associated with the user that is logged in.
    GetRestaurantByUserID(this.props.user._id)
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

  //Event handlers
  onChangeName = (e) => {
    e.preventDefault();
    if (this._isMounted) {
      this.setState({
        name: e.target.value,
      });
    }
  };
  onChangePrice = (e) => {
    e.preventDefault();
    if (this._isMounted) {
      this.setState({
        price: e.target.value,
      });
    }
  };
  onChangePrepTime = (e) => {
    e.preventDefault();
    if (this._isMounted) {
      this.setState({
        preptime: e.target.value,
      });
    }
  };
  onChangeCategory = (e) => {
    e.preventDefault();
    if (this._isMounted) {
      this.setState({
        category: e.target.value,
      });
    }
  };
  onChangeDescription = (e) => {
    e.preventDefault();
    if (this._isMounted) {
      this.setState({
        description: e.target.value,
      });
    }
  };
  onChangeThumbnail = (e) => {
    e.preventDefault();
    if (this._isMounted) {
      this.setState({
        thumbnail: e.target.files[0],
      });
    }
  };
  onChangeLargeImage = (e) => {
    e.preventDefault();
    if (this._isMounted) {
      this.setState({
        largeImage: e.target.files[0],
      });
    }
  };

  //The method renders the form to add, edit, delete a particular menu item.
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
        <br />
        <br />
        <label htmlFor="largeImage" className="ProfileFormTest">
          Please upload an image for your menu item (must be 550x350px)
        </label>
        <input
          type="file"
          name="largeImage"
          onChange={this.onChangeLargeImage}
        />
        <br />
        <br />
        <label htmlFor="thumbnail" className="ProfileFormTest">
          Please upload an thumbnail for your menu item (must be 150x130px)
        </label>
        <input type="file" name="thumbnail" onChange={this.onChangeThumbnail} />
        <div className="ProfileErrorMessage">{this.state.errorMessage}</div>
        <div className="ProfileSuccessMessage">{this.state.successMessage}</div>
      </React.Fragment>
    );
  };

  //Returns the categories that the user can select from in the form
  getCategories = (id) => {
    return Object.entries(this.state.menuItems).map((key) => {
      return (
        <option key={id + " " + key[0]} value={key[0]}>
          {key[0]}
        </option>
      );
    });
  };

  //Returns the additional categories not included in this.state.menuItems
  //that are created when a user adds a new category but doesn't save it.
  getAdditionalCategories = (id) => {
    return this.state.additionalCategories.map((currentCategory) => {
      return (
        <option key={id + " " + currentCategory} value={currentCategory}>
          {currentCategory}
        </option>
      );
    });
  };

  //Gets the menu items for a particular restaurant and sets it in the state
  getRestaurantMenuItems = (e) => {
    if (e.target.value !== "0") {
      let restaurantID = e.target.value;
      if (this._isMounted) {
        this.setState({
          restaurantSelectionMade: true,
          additionalCategories: [],
        });
      }
      GetMenuItemsByRestaurantID(e.target.value)
        .then((response) => {
          const groupedByCategory = _.groupBy(
            response.data,
            (menuitem) => menuitem.category
          );
          if (this._isMounted) {
            this.setState({
              restaurantID: restaurantID,
              menuItems: groupedByCategory,
              areMenuItemsLoaded: true,
            });
          }
        })
        .catch((error) => {
          if (this._isMounted) {
            this.setState({
              menuItems: null,
              areMenuItemsLoaded: true,
            });
          }
          console.log(error);
        });
    } else {
      if (this._isMounted) {
        this.setState({
          restaurantSelectionMade: false,
          areMenuItemsLoaded: false,
        });
      }
    }
  };

  //Returns the restaurants that a particular user can select from in an <option>
  getRestaurantSelection = () => {
    return this.state.restaurants.map((currentRestaurant) => {
      return (
        <option key={currentRestaurant._id} value={currentRestaurant._id}>
          {currentRestaurant.name + " - " + currentRestaurant.address}
        </option>
      );
    });
  };

  //Updates the state with a particular menu item's properties
  updateStateVals = (menuitem) => {
    let price = menuitem.price / 100;
    price.toLocaleString("en-US", { style: "currency", currency: "USD" });
    price = "$" + price;

    if (this._isMounted) {
      this.setState({
        name: menuitem.name,
        price: price,
        preptime: menuitem.preptime,
        category: menuitem.category,
        description: menuitem.description,
        errorMessage: "",
        successMessage: "",
        thumbnail: null,
        largeImage: null,
      });
    }
  };

  //Resets the state to its default values. Used when adding a new item/
  resetStateVals = (category) => {
    if (this._isMounted) {
      this.setState({
        name: "",
        price: "$0.00",
        preptime: 0,
        category: category,
        description: "",
        errorMessage: "",
        successMessage: "",
        thumbnail: null,
        largeImage: null,
      });
    }
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
    if (errorMessage && this._isMounted) {
      this.setState({
        errorMessage: errorMessage,
      });
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

  //This method adds a menu item to a restaurant
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

      AddMenuItem(pkg)
        .then((response) => {
          if (this._isMounted) {
            this.setState({
              successMessage: "Successfully added menu item!",
              errorMessage: "",
            });
          }

          //If appliciable, upload images
          if (this.state.thumbnail !== null || this.state.largeImage !== null) {
            if (this.state.thumbnail !== null) {
              let formData = new FormData();
              formData.append("file", this.state.thumbnail);
              formData.append("path", response.data.id + "/small.png");

              UploadFile(formData)
                .then(() => {
                  window.location.reload(true);
                })
                .catch(() => {
                  console.log("Image upload failed");
                });
            }

            if (this.state.largeImage !== null) {
              let formData = new FormData();
              formData.append("file", this.state.largeImage);
              formData.append("path", response.data.id + "/large.png");

              UploadFile(formData)
                .then(() => {
                  window.location.reload(true);
                })
                .catch(() => {
                  console.log("Image upload failed");
                });
            }
          } else {
            window.location.reload(true);
          }
        })
        .catch((error) => {
          if (this._isMounted) {
            this.setState({
              errorMessage:
                "An unxpected error has occurred. Please try again later.",
              successMessage: "",
            });
          }
          console.log(error);
        });
    }
  };

  //This method updates a menu item within a restaurant
  onUpdateMenuItem = (e, id) => {
    e.preventDefault();
    if (this.validateForm()) {
      //If appliciable, upload images
      if (this.state.thumbnail !== null) {
        let formData = new FormData();
        formData.append("file", this.state.thumbnail);
        formData.append("path", id + "/small.png");

        UploadFile(formData)
          .then()
          .catch(() => {
            console.log("Image upload failed");
          });
      }

      if (this.state.largeImage !== null) {
        let formData = new FormData();
        formData.append("file", this.state.largeImage);
        formData.append("path", id + "/large.png");

        UploadFile(formData)
          .then()
          .catch(() => {
            console.log("Image upload failed");
          });
      }

      let pkg = {
        name: this.state.name,
        price: this.parsePrice(this.state.price),
        preptime: parseInt(this.state.preptime, 10),
        category: this.state.category,
        description: this.state.description,
      };

      UpdateMenuItem(id, pkg)
        .then(() => {
          if (this._isMounted) {
            this.setState({
              successMessage: "Successfully edited menu item!",
              errorMessage: "",
            });
          }
          window.location.reload(true);
        })
        .catch((error) => {
          if (this._isMounted) {
            this.setState({
              errorMessage:
                "An unxpected error has occurred. Please try again later.",
              successMessage: "",
            });
          }
          console.log(error);
        });
    }
  };

  //This method deletes a particular menu item from a restaurant
  onDeleteMenuItem = (e, id) => {
    e.preventDefault();
    if (
      window.confirm(
        "WARNING: This will delete your menu item.\nAre you sure you want to do this?"
      )
    ) {
      DeleteMenuItem(id)
        .then(() => {
          if (this._isMounted) {
            this.setState({
              successMessage: "Successfully deleted menu item",
              errorMessage: "",
            });
          }
          window.location.reload(true);
        })
        .catch((error) => {
          if (this._isMounted) {
            this.setState({
              errorMessage:
                "An unxpected error has occurred. Please try again later.",
              successMessage: "",
            });
          }
          console.log(error);
        });
    }
  };

  //This method adds a category to "additionalCategories" in the state
  onAddCategory = () => {
    let categoryName = prompt(
      "Please enter the name of the category you would like to add."
    );
    if (categoryName !== "" && categoryName !== null) {
      let additionalCategories = this.state.additionalCategories;
      additionalCategories.unshift(categoryName);

      if (this._isMounted) {
        this.setState({
          additionalCategories,
        });
      }
    }
  };

  //This method renders the accordian for a particular menu item.
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

  //This method renders each menu item category and the accordians underneath them
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
      return null;
    }
  };

  //This method renders the categories that have not yet been saved to the server,
  //along with the accordion "Add new item+"
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
      return null;
    }
  };

  render() {
    const {
      areRestaurantsLoaded,
      restaurants,
      areMenuItemsLoaded,
      menuItems,
      additionalCategories,
    } = this.state;

    if (areRestaurantsLoaded) {
      if (restaurants.length > 0) {
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

              {areMenuItemsLoaded && (
                <Button
                  style={{ width: 150, marginLeft: 20 }}
                  onClick={() => this.onAddCategory()}
                >
                  Add Category
                </Button>
              )}
            </div>
            {areMenuItemsLoaded &&
              additionalCategories.length === 0 &&
              Object.keys(menuItems).length === 0 && (
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
