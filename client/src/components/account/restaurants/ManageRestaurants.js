//Import libraries
import React, { Component } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import { TimePicker } from "antd";
import moment from "moment";
import axios from "axios";

//Import assets
import Loader from "../../../assets/loader/Loader";

//Import stylesheets
import "./ManageRestaurants.css";
import "antd/dist/antd.css";

export default class ManageRestaurants extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      restaurants: [],
      areRestaurantsLoaded: false,
      errorMessage: "",
      name: "",
      address: "",
      rating: 0,
      price: 0,
      minorder: 0,
      description: "",
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

  //Event handlers for each form field
  onChangeName = (e) => {
    this.setState({ name: e.target.value });
    e.preventDefault();
  };
  onChangeAddress = (e) => {
    this.setState({ address: e.target.value });
    e.preventDefault();
  };
  onChangePrice = (e) => {
    this.setState({ price: e.target.value });
    e.preventDefault();
  };
  onChangeMinOrder = (e) => {
    this.setState({ minorder: e.target.value });
    e.preventDefault();
  };
  onChangeRating = (e) => {
    this.setState({ rating: e.target.value });
    e.preventDefault();
  };
  onChangeDescription = (e) => {
    this.setState({ description: e.target.value });
    e.preventDefault();
  };

  //This method converts a given time the format we represent times with,
  //then updates that time in the state restaurants object
  onChangeTime = (time, dayOfWeek, firstShift) => {
    let adjustedStartTime;
    let adjustedEndTime;
    if (time !== null) {
      let startTimeHour = time[0]._d.getHours();
      let endTimeHour = time[1]._d.getHours();

      //Converts the time object from the format "HH:mm" into the format "HHmm"
      adjustedStartTime = startTimeHour * 100 + time[0]._d.getMinutes();
      adjustedEndTime = endTimeHour * 100 + time[1]._d.getMinutes();

      //Converts to string and adds a leading 0 if before 10:00am
      startTimeHour > 9
        ? (adjustedStartTime = adjustedStartTime.toString(10))
        : (adjustedStartTime = "0" + adjustedStartTime.toString(10));
      endTimeHour > 9
        ? (adjustedEndTime = adjustedEndTime.toString(10))
        : (adjustedEndTime = "0" + adjustedEndTime.toString(10));
    } else {
      adjustedStartTime = "0000";
      adjustedEndTime = "0000";
    }

    let hoursofoperation = this.state.hoursofoperation;

    if (firstShift) {
      hoursofoperation[dayOfWeek][0] = adjustedStartTime;
      hoursofoperation[dayOfWeek][1] = adjustedEndTime;
    } else {
      hoursofoperation[dayOfWeek][2] = adjustedStartTime;
      hoursofoperation[dayOfWeek][3] = adjustedEndTime;
    }

    this.setState({ hoursofoperation: hoursofoperation });
  };

  //This method copies the restaurant data directly into seperate state
  //variables. This eliminates the need to modify the restaurant object directly
  updateStateVals = (restaurant) => {
    let minorder = restaurant.minorder / 100;
    minorder.toLocaleString("en-US", { style: "currency", currency: "USD" });
    minorder = "$" + minorder;

    this.setState({
      name: restaurant.name,
      address: restaurant.address,
      rating: restaurant.rating,
      price: restaurant.price,
      minorder: minorder,
      description: restaurant.description,
      ownerId: this.props.user._id,
      hoursofoperation: restaurant.hoursofoperation,
    });
  };

  //This resets the state values for adding restaurants
  resetStateVals = () => {
    this.setState({
      name: "",
      address: "",
      rating: 0,
      price: 0,
      minorder: "$0.00",
      description: "",
      ownerId: this.props.user._id,
      hoursofoperation: [],
    });
  };

  //This method displays the operating hours
  getTime = (dayOfWeek) => {
    const { RangePicker } = TimePicker;
    return (
      <React.Fragment>
        <div className="ManageRestaurantTimeCol">
          <RangePicker
            use12Hours
            size="small"
            format="h:mm a"
            minuteStep={5}
            onChange={(time) => this.onChangeTime(time, dayOfWeek, true)}
            value={
              this.state.hoursofoperation &&
              this.state.hoursofoperation.length > 0
                ? [
                    moment(this.state.hoursofoperation[dayOfWeek][0], "HH:mm"),
                    moment(this.state.hoursofoperation[dayOfWeek][1], "HH:mm"),
                  ]
                : ""
            }
          />
        </div>
        <div className="ManageRestaurantTimeCol">
          <RangePicker
            use12Hours
            size="small"
            format="h:mm a"
            minuteStep={5}
            onChange={(time) => this.onChangeTime(time, dayOfWeek, false)}
            value={
              this.state.hoursofoperation &&
              this.state.hoursofoperation.length > 0
                ? [
                    moment(this.state.hoursofoperation[dayOfWeek][2], "HH:mm"),
                    moment(this.state.hoursofoperation[dayOfWeek][3], "HH:mm"),
                  ]
                : ""
            }
          />
        </div>
      </React.Fragment>
    );
  };

  //This method prints out the form
  getForm = (id) => {
    return (
      <React.Fragment>
        <label htmlFor="name" className="ProfileFormTest">
          Restaurant name
        </label>
        <input
          type="text"
          name="name"
          value={this.state.name}
          onChange={this.onChangeName}
          className="ManageRestaurantInputBox"
          required
        />
        <label htmlFor="name" className="ProfileFormTest">
          Restaurant address
        </label>
        <input
          type="text"
          name="name"
          value={this.state.address}
          onChange={this.onChangeAddress}
          className="ManageRestaurantInputBox"
          required
        />
        <label htmlFor="price" className="ProfileFormTest">
          What is the price scale of your restaurant?
        </label>
        <select
          id={id + " price"}
          value={this.state.price}
          onChange={this.onChangePrice}
          className="ManageRestaurantInputBox"
        >
          <option value="0"></option>
          <option value="1">$ - Very inexpensive</option>
          <option value="2">$$ - Inexpensive</option>
          <option value="3">$$$ - Average</option>
          <option value="4">$$$$ - Upscale</option>
          <option value="5">$$$$$ - Fine dining</option>
        </select>
        <label htmlFor="minorder" className="ProfileFormTest">
          What is the minimum order price at your restaurant? Please use the
          format $xx.xx.
        </label>
        <input
          type="text"
          name="minorder"
          value={this.state.minorder}
          onChange={this.onChangeMinOrder}
          className="ManageRestaurantInputBox"
          required
        />
        <label htmlFor="quality" className="ProfileFormTest">
          On a scale of 1 to 10, what would you rate your restaurant? (will be
          replaced with user reviews later)
        </label>
        <select
          id={id + " quality"}
          value={this.state.rating}
          onChange={this.onChangeRating}
          className="ManageRestaurantInputBox"
        >
          <option value="0">No reviews have been given</option>
          <option value="1">1 - Extremely bad</option>
          <option value="2">2 - Very bad</option>
          <option value="3">3 - Pretty bad</option>
          <option value="4">4 - It could be better</option>
          <option value="5">5 - It's okay</option>
          <option value="6">6 - It could be worse</option>
          <option value="7">7 - Pretty good</option>
          <option value="8">8 - Very good</option>
          <option value="9">9 - Extremely good</option>
          <option value="10">10 - Amazing</option>
        </select>
        <label htmlFor="hours" className="ProfileFormTest">
          What are your operating hours?
        </label>
        <div className="ManageRestaurantTime">
          <div style={{ width: 100 }} />
          <div className="ManageRestaurantTimeCol">Shift 1</div>
          <div className="ManageRestaurantTimeCol">Shift 2</div>
        </div>
        <div className="ManageRestaurantTime" style={{ marginTop: 7 }}>
          <div style={{ width: 100 }}>Sunday:</div>
          {this.getTime(0)}
        </div>
        <div className="ManageRestaurantTime">
          <div style={{ width: 100 }}>Monday:</div>
          {this.getTime(1)}
        </div>
        <div className="ManageRestaurantTime">
          <div style={{ width: 100 }}>Tuesday:</div>
          {this.getTime(2)}
        </div>
        <div className="ManageRestaurantTime">
          <div style={{ width: 100 }}>Wednesday:</div>
          {this.getTime(3)}
        </div>
        <div className="ManageRestaurantTime">
          <div style={{ width: 100 }}>Thursday:</div>
          {this.getTime(4)}
        </div>
        <div className="ManageRestaurantTime">
          <div style={{ width: 100 }}>Friday:</div>
          {this.getTime(5)}
        </div>
        <div className="ManageRestaurantTime">
          <div style={{ width: 100 }}>Saturday:</div>
          {this.getTime(6)}
        </div>
        <label
          htmlFor="description"
          className="ProfileFormTest"
          style={{ paddingTop: 20 }}
        >
          How would you describe your restaurant?
        </label>
        <textarea
          id={id + " description"}
          value={this.state.description}
          onChange={this.onChangeDescription}
          className="ManageRestaurantTextArea"
          required
        />
        <div className="ProfileErrorMessage">{this.state.errorMessage}</div>
      </React.Fragment>
    );
  };

  //TODO: This method handles form submission for editing restaurants
  onEditRestaurant = (e) => {
    e.preventDefault();
    if (this.validateForm()) {
      //let minorderint = this.parseMinOrder(this.state.minorder);
      //Todo - Make API call
      return false;
    }
    return false;
  };

  //TODO: This method handles form submission for adding restaurants
  onAddRestaurant = (e) => {
    e.preventDefault();
    if (this.validateForm()) {
      //let minorderint = this.parseMinOrder(this.state.minorder);
      //Todo - Make API call
      return false;
    }
    return false;
  };

  //TODO: This method handles form submission for deleting restaurants
  onDeleteRestaurant = () => {
    alert("To do");
    return false;
  };

  //This method validates the form.
  //Todo: Operating hour verification
  validateForm = () => {
    //Regular expression courtesy of https://stackoverflow.com/questions/8829765/regular-expression-for-dollar-amount-in-javascript
    const minorderVerification = /^\$?[0-9]+(\.[0-9][0-9])?$/;
    let errorMessage = "";
    if (this.state.price == 0) {
      errorMessage = errorMessage.concat(
        "You must enter a price scale value. \n"
      );
    }
    if (!minorderVerification.test(this.state.minorder)) {
      errorMessage = errorMessage.concat(
        "The minimum order price must be in the format $xx.xx \n"
      );
    }
    if (errorMessage) {
      this.setState({ errorMessage });
      return false;
    }
    this.setState({ errorMessage: "" });
    return true;
  };

  //This method turns "$xxx.yy" into an integer xxxyy
  parseMinOrder = (minorderstring) => {
    let stringArr = minorderstring.split(".");
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

  restaurantList = () => {
    if (this.state.areRestaurantsLoaded) {
      return this.state.restaurants.map((currentRestaurant) => {
        return (
          <Card key={currentRestaurant._id}>
            <Accordion.Toggle
              as={Card.Header}
              onClick={() => this.updateStateVals(currentRestaurant)}
              eventKey={currentRestaurant._id}
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Restaurant: </div>
              <div className="ProfileUserInfo">{currentRestaurant.name}</div>
              <div className="ProfileEditLink">Edit</div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={currentRestaurant._id}>
              <Card.Body>
                <form onSubmit={this.onEditRestaurant}>
                  {this.getForm(currentRestaurant._id)}
                  <Button variant="success" type="submit">
                    Edit restaurant
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => this.onDeleteRestaurant()}
                    style={{ marginLeft: 30 }}
                  >
                    Delete restaurant
                  </Button>
                </form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        );
      });
    } else {
      return <Loader />;
    }
  };

  render() {
    return (
      <div>
        <h2>Restaurant Info</h2>
        <Accordion>
          {this.restaurantList()}
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              onClick={() => this.resetStateVals()}
              eventKey="0"
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Add Restaurant+</div>
              <div className="ProfileEditLink">Add</div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <form onSubmit={this.onAddRestaurant}>
                  {this.getForm(0)}
                  <Button variant="success" type="submit">
                    Add restaurant
                  </Button>
                </form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
}
