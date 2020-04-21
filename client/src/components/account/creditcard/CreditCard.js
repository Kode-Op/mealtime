//Import libraries
import React, { Component } from "react";
//import axios from "axios";
import { Accordion, Card, Button } from "react-bootstrap";

//Import assets
import Loader from "../../../assets/loader/Loader";

//Import utilities
import {GetCreditCardByID} from "../../../utils/creditcards/GetCreditCardByID";
import {DelCreditCardByID} from "../../../utils/creditcards/DelCreditCardByID";
import {AddCreditCard} from "../../../utils/creditcards/AddCreditCard";

//Import stylesheets
import "./CreditCard.css";

export default class CreditCard extends Component {
  constructor(props) {
    super(props);

    //Each variable will store the input field values
    this.state = {
      isLoaded: false,
      creditCards: [],
      ccfname: "",
      cclname: "",
      ccnumber: "",
      ccv: "",
      ccmonth: "",
      ccyear: "",
      ccaddress: "",
      successmessage: "",
      errormessage: "",
    };
  }

  componentDidMount() {
    //Load the credit card data associated with the user that's logged in.

    GetCreditCardByID(this.props.user._id)
      .then((response) => {
        this.setState({ creditCards: response.data, isLoaded: true });
      })
      .catch(() => {
        this.setState({ isLoaded: true });
      });
  }

  //Event handlers for each form field
  onChangeFName = (e) => {
    this.setState({
      ccfname: e.target.value,
    });
  };
  onChangeLName = (e) => {
    this.setState({
      cclname: e.target.value,
    });
  };
  onChangeNumber = (e) => {
    this.setState({
      ccnumber: e.target.value,
    });
  };
  onChangeCCV = (e) => {
    this.setState({
      ccv: e.target.value,
    });
  };
  onChangeMonth = (e) => {
    this.setState({
      ccmonth: e.target.value,
    });
  };
  onChangeYear = (e) => {
    this.setState({
      ccyear: e.target.value,
    });
  };
  onChangeAddress = (e) => {
    this.setState({
      ccaddress: e.target.value,
    });
  };

  //Event handlers for when the user submits the forms on the page
  onAddCard = (e) => {
    e.preventDefault();

    if (this.validateCard()) {
      let pkg = {
        userId: this.props.user._id,
        firstName: this.state.ccfname,
        lastName: this.state.cclname,
        number: this.state.ccnumber,
        exMonth: this.state.ccmonth,
        exYear: this.state.ccyear,
        ccv: this.state.ccv,
        address: this.state.ccaddress,
        isDeleted: false,
      };

      AddCreditCard(pkg)
        .then(() => {
          this.setState({
            successmessage: "Successfully added card!",
            errormessage: "",
          });
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.setState({
              errormessage:
                "404 user not found. Please refresh page and try again.",
              successmessage: "",
            });
          } else {
            this.setState({
              errormessage:
                "400 internal server error. Please try again later.",
              successmessage: "",
            });
          }
        });
    }
    e.preventDefault();
  };

  onDeleteCard = (cardID) => {
    return function () {
      DelCreditCardByID(cardID)
        .then(() => {
          window.location.reload(false);
        })
        .catch((error) => {
          console.log(error);
        });
    };
  };

  //This helper function verifies that the credit card is in the right format
  validateCard = () => {
    let errorMessage = "";
    this.setState({ errormessage: "" });

    if (this.state.ccnumber.length !== 16) {
      errorMessage = errorMessage.concat(
        "Your credit card must have 16 characters.\n"
      );
    }
    if (isNaN(this.state.ccnumber)) {
      errorMessage = errorMessage.concat(
        "Your credit card must only contain numbers.\n"
      );
    }
    if (this.state.ccv.length !== 3) {
      errorMessage = errorMessage.concat("Your CCV must have 3 characters.\n");
    }
    if (this.state.ccmonth === "blankmonth" || this.state.ccmonth === "") {
      errorMessage = errorMessage.concat("You must enter a month.\n");
    }
    if (this.state.ccyear === "blankyear" || this.state.ccyear === "") {
      errorMessage = errorMessage.concat("You must enter a year.\n");
    }
    if (errorMessage) {
      this.setState({ errormessage: errorMessage });
      return false;
    }
    return true;
  };

  //This method renders each credit card that belongs to the user
  creditCardList = () => {
    if (this.state.isLoaded) {
      return this.state.creditCards.map((currentCard) => {
        return (
          <Card key={currentCard._id}>
            <Accordion.Toggle
              as={Card.Header}
              eventKey={currentCard._id}
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Card: </div>
              <div className="ProfileUserInfo">
                {currentCard.firstName} {currentCard.lastName} -{" "}
                {currentCard.number}
              </div>
              <div className="ProfileEditLink">Delete</div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={currentCard._id}>
              <Card.Body>
                <h5>Are you sure?</h5>
                <div className="ProfileErrorMessage">
                  {this.state.errorMessageName}
                </div>
                <Button
                  variant="danger"
                  onClick={this.onDeleteCard(currentCard._id)}
                >
                  Delete Card
                </Button>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        );
      });
    } else {
      return <Loader />;
    }
  };

  //This method creates a dropdown box option for each year, starting with
  //the current year, and ending with the current year + numYears
  getYearSelection = (numYears) => {
    let start = new Date().getFullYear();
    let rows = [];
    for (let year = start; year <= start + numYears; year++) {
      rows.push(
        <option value={year} key={year}>
          {year}
        </option>
      );
    }
    return rows;
  };

  render() {
    return (
      <div>
        <h2>Credit Card Info</h2>
        <Accordion>
          {this.creditCardList()}
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="0"
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Add Card+</div>
              <div className="ProfileEditLink">Add</div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <form onSubmit={this.onAddCard}>
                  <div className="CreditCardNameContainer">
                    <div>
                      <label htmlFor="fname" className="ProfileFormTest">
                        First name
                      </label>
                      <input
                        type="text"
                        name="fname"
                        value={this.state.ccfName}
                        onChange={this.onChangeFName}
                        className="CreditCardFirstName"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lname" className="ProfileFormTest">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lname"
                        value={this.state.cclName}
                        onChange={this.onChangeLName}
                        className="CreditCardLastName"
                        required
                      />
                    </div>
                  </div>
                  <label htmlFor="number" className="ProfileFormTest">
                    Credit card number
                  </label>
                  <input
                    type="text"
                    name="number"
                    maxLength="16"
                    value={this.state.ccnumber}
                    onChange={this.onChangeNumber}
                    className="CreditCardInputBox"
                    required
                  />
                  <div className="CreditCardExpContainer">
                    <div>
                      <label htmlFor="month" className="ProfileFormTest">
                        Exp. Month
                      </label>

                      <select
                        id="month"
                        onChange={this.onChangeMonth}
                        className="CreditCardMonth"
                      >
                        <option value="blankmonth"></option>
                        <option value="01">01 - January</option>
                        <option value="02">02 - February</option>
                        <option value="03">03 - March</option>
                        <option value="04">04 - April</option>
                        <option value="05">05 - May</option>
                        <option value="06">06 - June</option>
                        <option value="07">07 - July</option>
                        <option value="08">08 - August</option>
                        <option value="09">09 - September</option>
                        <option value="10">10 - October</option>
                        <option value="11">11 - November</option>
                        <option value="12">12 - December</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="year" className="ProfileFormTest">
                        Exp. Year
                      </label>
                      <select
                        id="year"
                        onChange={this.onChangeYear}
                        className="CreditCardYear"
                      >
                        <option value="blankyear"></option>
                        {this.getYearSelection(10)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="ccv" className="ProfileFormTest">
                        CCV
                      </label>
                      <input
                        type="text"
                        maxLength="3"
                        name="ccv"
                        value={this.state.ccv}
                        onChange={this.onChangeCCV}
                        className="CreditCardCCV"
                        required
                      />
                    </div>
                  </div>
                  <label htmlFor="address" className="ProfileFormTest">
                    Billing address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={this.state.ccaddress}
                    onChange={this.onChangeAddress}
                    className="CreditCardInputBox"
                    required
                  />
                  <div className="ProfileErrorMessage">
                    {this.state.errormessage}
                  </div>
                  <div className="ProfileSuccessMessage">
                    {this.state.successmessage}
                  </div>
                  <Button variant="success" type="submit">
                    Add credit card
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
