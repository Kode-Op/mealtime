//Import libraries
import React, { Component } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import { TimePicker } from "antd";
import moment from "moment";
//import axios from "axios";

//Import assets
import Loader from "../../../assets/loader/Loader";

//Import utilities
import TagBank from "../../../utils/Tags";
import GetRestaurantByID from "../../../utils/managerestaurants/GetRestaurantByID";
import EditRestaurant from "../../../utils/managerestaurants/EditRestaurant";
import AddRestaurant from "../../../utils/managerestaurants/AddRestaurant";
import DeleteRestaurant from "../../../utils/managerestaurants/DeleteRestaurant";

//Import stylesheets
import "./ManageRestaurants.css";
import "antd/dist/antd.css";

export default class ManageRestaurants extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    //Instantiate a 7x4 matrix;
    let hourmatrix = new Array(7);
    for (let i = 0; i < hourmatrix.length; i++) {
      hourmatrix[i] = ["0000", "0100", "0900", "1159"];
    }

    this.state = {
      restaurants: [],
      areRestaurantsLoaded: false,
      successMessage: "",
      errorMessage: "",
      tagWarning: "",
      name: "",
      address: "",
      rating: 0,
      price: 0,
      minorder: 0,
      description: "",
      tags: [],
      tagbank: TagBank,
      hoursofoperation: hourmatrix,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    //Load the restaurant data associated with the user that is logged in.
    GetRestaurantByID(this.props.user._id)
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
      let startTimeHours = time[0]._d.getHours();
      let endTimeHours = time[1]._d.getHours();
      let startTimeMinutes = time[0]._d.getMinutes();
      let endTimeMinutes = time[1]._d.getMinutes();

      //Converts the time object from the format "HH:mm" into the format "HHmm"
      adjustedStartTime = startTimeHours * 100 + startTimeMinutes;
      adjustedEndTime = endTimeHours * 100 + endTimeMinutes;

      //Converts to string and adds a leading 0 if before 10:00am,
      //and two leading zeros if before 1:00am, and adds three leading
      //zeros if before 12:10am

      if (startTimeHours === 0 && startTimeMinutes < 10) {
        adjustedStartTime = "000" + adjustedStartTime.toString(10);
      } else if (startTimeHours === 0 && startTimeMinutes >= 10) {
        adjustedStartTime = "00" + adjustedStartTime.toString(10);
      } else if (startTimeHours <= 9) {
        adjustedStartTime = "0" + adjustedStartTime.toString(10);
      } else {
        adjustedStartTime = adjustedStartTime.toString(10);
      }

      if (endTimeHours === 0 && endTimeMinutes < 10) {
        adjustedEndTime = "000" + adjustedEndTime.toString(10);
      } else if (endTimeHours === 0 && endTimeMinutes >= 10) {
        adjustedEndTime = "00" + adjustedEndTime.toString(10);
      } else if (endTimeHours <= 9) {
        adjustedEndTime = "0" + adjustedEndTime.toString(10);
      } else {
        adjustedEndTime = adjustedEndTime.toString(10);
      }
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
      errorMessage: "",
      successMessage: "",
      tagWarning: "",
      name: restaurant.name,
      address: restaurant.address,
      rating: restaurant.rating,
      price: restaurant.price,
      minorder: minorder,
      tags: restaurant.tags,
      description: restaurant.description,
      hoursofoperation: restaurant.hoursofoperation,
    });
  };

  //This resets the state values for adding restaurants
  resetStateVals = () => {
    //Instantiate a 7x4 matrix
    let hourmatrix = new Array(7);
    for (let i = 0; i < hourmatrix.length; i++) {
      hourmatrix[i] = ["0000", "0100", "0900", "1159"];
    }

    this.setState({
      errorMessage: "",
      successMessage: "",
      tagWarning: "",
      name: "",
      address: "",
      rating: 0,
      price: 0,
      minorder: "$0.00",
      tags: [],
      description: "",
      hoursofoperation: hourmatrix,
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
              this.state.hoursofoperation[dayOfWeek][0] !== "0000" ||
                this.state.hoursofoperation[dayOfWeek][1] !== "0000"
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
              this.state.hoursofoperation[dayOfWeek][2] !== "0000" ||
                this.state.hoursofoperation[dayOfWeek][3] !== "0000"
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

  //This method adds a tag to the tag array in the state.
  addTag = (index) => {
    if (this.state.tags.length < 6) {
      this.setState({
        tags: [...this.state.tags, index],
        tagWarning: "",
      });
    } else {
      this.setState({ tagWarning: "You many only select up to 6 tags" });
    }
  };

  //This method removes a tag from the tag array in the state.
  removeTag = (i) => {
    if (this.state.tags.length > 0) {
      let tags = this.state.tags;
      let index = tags.indexOf(i);
      if (index !== -1) {
        tags.splice(index, 1);
        this.setState({
          tags: tags,
          tagWarning: "",
        });
      }
    }
  };

  //This method obtains and styles the tag bank, applying a different style to
  //those already included in the tags
  getTagBank = () => {
    let rows = [];
    this.state.tagbank.forEach((item, i) => {
      if (!this.state.tags.includes(i)) {
        rows.push(
          <div
            key={i}
            className="ManageRestaurantTagItem"
            onClick={() => this.addTag(i)}
          >
            {item}
          </div>
        );
      } else {
        rows.push(
          <div
            key={i}
            className="ManageRestaurantTagItemSelected"
            onClick={() => this.removeTag(i)}
          >
            {item}
          </div>
        );
      }
    });
    return rows;
  };

  //This method obtains and styles the applied tags.
  getTagList = () => {
    let rows = [];
    this.state.tags.forEach((item, i) => {
      rows.push(
        <div
          key={i}
          className="ManageRestaurantTagItemSelected"
          onClick={() => this.removeTag(item)}
        >
          {this.state.tagbank[item]}
        </div>
      );
    });
    return rows;
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
          Please select at most 6 tags for your restaurant:
        </label>
        <div className="ManageRestaurantTagComponent">
          <div className="ManageRestaurantAppliedTags">
            {this.getTagList()}
            <div
              style={{
                color: "red",
                display: "inline",
                marginLeft: 10,
              }}
            >
              {this.state.tagWarning}
            </div>
          </div>
          <div className="ManageRestaurantTagArea">{this.getTagBank()}</div>
        </div>
        <label htmlFor="description" className="ProfileFormTest">
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
        <div className="ProfileSuccessMessage">{this.state.successMessage}</div>
      </React.Fragment>
    );
  };

  //This method handles form submission for editing restaurants
  onUpdateRestaurant = (e, restaurantID) => {
    e.preventDefault();
    if (this.validateForm()) {
      let pkg = {
        minorder: this.parseMinOrder(this.state.minorder),
        address: this.state.address,
        hoursofoperation: this.state.hoursofoperation,
        tags: this.state.tags,
        name: this.state.name,
        price: this.state.price,
        rating: this.state.rating,
        description: this.state.description,
      };

      EditRestaurant(restaurantID, pkg)
        .then(() => {
          this.setState({
            successMessage: "Successfully edited restaurant!",
            errorMessage: "",
          });
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

  //This method handles form submission for adding restaurants
  onAddRestaurant = (e) => {
    e.preventDefault();
    if (this.validateForm()) {
      let pkg = {
        name: this.state.name,
        price: parseInt(this.state.price, 10),
        rating: parseInt(this.state.rating, 10),
        description: this.state.description,
        minorder: this.parseMinOrder(this.state.minorder),
        address: this.state.address,
        hoursofoperation: this.state.hoursofoperation,
        ownerId: this.props.user._id,
        isDeleted: false,
        tags: this.state.tags,
      };

      AddRestaurant(pkg)
        .then(() => {
          this.setState({
            successMessage: "Successfully added restaurant!",
            errorMessage: "",
          });
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

  //This method handles form submission for deleting restaurants
  onDeleteRestaurant = (e, restaurantID) => {
    e.preventDefault();
    if (
      window.confirm(
        "WARNING: This will delete your restaurant.\nAre you sure you want to do this?"
      )
    ) {
      DeleteRestaurant(restaurantID)
        .then(() => {
          this.setState({
            successMessage: "Successfully deleted restaurant.",
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

  //This method validates the form.
  //Todo: Operating hour verification
  validateForm = () => {
    //Regular expression courtesy of https://stackoverflow.com/questions/8829765/regular-expression-for-dollar-amount-in-javascript
    const minorderVerification = /^\$?[0-9]+(\.[0-9][0-9])?$/;
    let errorMessage = "";
    if (this.state.price === "0") {
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
                <form
                  onSubmit={(e) =>
                    this.onUpdateRestaurant(e, currentRestaurant._id)
                  }
                >
                  {this.getForm(currentRestaurant._id)}
                  <Button variant="success" type="submit">
                    Update restaurant
                  </Button>
                  <Button
                    variant="danger"
                    onClick={(e) =>
                      this.onDeleteRestaurant(e, currentRestaurant._id)
                    }
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
