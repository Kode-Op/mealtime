//Import libraries
import React, { Component } from "react";
import { Accordion, Card } from "react-bootstrap";
import axios from "axios";

//Import assets
import Loader from "../../../assets/loader/Loader";

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

  getRestaurantMenuItems = (e) => {
    if (e.target.value !== "0") {
      this.setState({ restaurantSelectionMade: true });
      axios
        .get("/api/menuitems/" + e.target.value)
        .then((response) => {
          this.setState({
            menuItems: response.data,
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
      this.setState({ restaurantSelectionMade: false });
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

  renderMenuItems = () => {
    if (this.state.restaurantSelectionMade) {
      if (this.state.areMenuItemsLoaded) {
        return this.state.menuItems.map((currentMenuItem) => {
          return (
            <Card key={currentMenuItem._id}>
              <Accordion.Toggle
                as={Card.Header}
                //onClick={() => this.updateStateVals(currentRestaurant)}
                eventKey={currentMenuItem._id}
                style={{ cursor: "pointer" }}
              >
                <div className="ProfileHeaderLeft">{currentMenuItem.name}</div>
                <div className="ProfileUserInfo">
                  {currentMenuItem.description.length > 83
                    ? currentMenuItem.description.substring(0, 80) + "..."
                    : currentMenuItem.description}
                </div>
                <div className="ProfileEditLink">Edit</div>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={currentMenuItem._id}>
                <Card.Body>
                  <div>Hello, world.</div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
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
      return (
        <div>
          <h2>Please select a restaurant</h2>
          <select
            id="0"
            onChange={this.getRestaurantMenuItems}
            //className="ManageRestaurantInputBox"
          >
            <option value="0"></option>
            {this.getRestaurantSelection()}
          </select>
          <Accordion>{this.renderMenuItems()}</Accordion>
        </div>
      );
    } else {
      return <Loader />;
    }
  }
}
