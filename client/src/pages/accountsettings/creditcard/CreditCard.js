import React, { Component } from "react";
import axios from "axios";
import { Accordion, Card, Button } from "react-bootstrap";
import Loader from "../../../assets/loader/Loader";

export default class CreditCard extends Component {
  constructor(props) {
    super(props);

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
      ccpassword: "",
      successmessage: "",
      errormessage: "",
      deletemessage: ""
    };
  }

  componentDidMount() {
    this.onChangeFName = this.onChangeFName.bind(this);
    this.onChangeLName = this.onChangeLName.bind(this);
    this.onChangeNumber = this.onChangeNumber.bind(this);
    this.onChangeCCV = this.onChangeCCV.bind(this);
    this.onChangeMonth = this.onChangeMonth.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onAddCard = this.onAddCard.bind(this);
    this.onDeleteCard = this.onDeleteCard.bind(this);

    axios
      .get("/api/creditCards/" + this.props.user.data._id)
      .then(response => {
        this.setState({ creditCards: response.data, isLoaded: true });
      })
      .catch(error => {
        this.setState({ isLoaded: true });
      });
  }

  onChangeFName(e) {
    this.setState({
      ccfname: e.target.value
    });
  }
  onChangeLName(e) {
    this.setState({
      cclname: e.target.value
    });
  }

  onChangeNumber(e) {
    this.setState({
      ccnumber: e.target.value
    });
  }

  onChangeCCV(e) {
    this.setState({
      ccv: e.target.value
    });
  }

  onChangeMonth(e) {
    this.setState({
      ccmonth: e.target.value
    });
  }

  onChangeYear(e) {
    this.setState({
      ccyear: e.target.value
    });
  }

  onChangeAddress(e) {
    this.setState({
      ccaddress: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      ccpassword: e.target.value
    });
  }

  creditCardList() {
    if (this.state.isLoaded) {
      return this.state.creditCards.map(currentCard => {
        return (
          <Card>
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
  }

  onAddCard(e) {
    //TODO - form validation
    this.setState({ deletemessage: "" });
    let pkg = {
      userId: this.props.user.data._id,
      firstName: this.state.ccfname,
      lastName: this.state.cclname,
      number: this.state.ccnumber,
      exMonth: this.state.ccmonth,
      exYear: this.state.ccyear,
      ccv: this.state.ccv,
      address: this.state.ccaddress,
      isDeleted: false
    };

    axios
      .post("/api/creditCards/add", pkg)
      .then(() => {
        this.setState({
          successmessage: "Successfully added card!",
          errormessage: ""
        });
      })
      .catch(error => {
        if (error.response.status === 404) {
          this.setState({
            errormessage:
              "404 user not found. Please refresh page and try again.",
            successmessage: ""
          });
        } else if (error.response.status === 500) {
          this.setState({
            errormessage: "Error! Invalid current password",
            successmessage: ""
          });
        } else {
          this.setState({
            errormessage: "400 internal server error. Please try again later.",
            successmessage: ""
          });
        }
      });
    e.preventDefault();
  }

  onDeleteCard(cardID) {
    return function() {
      axios
        .delete("/api/creditCards/" + cardID)
        .then(() => {
          this.setState({ deletemessage: "Card successfully deleted!" });
        })
        .catch(error => {
          this.setState({ deletemessage: "" });
          console.log(error);
        });
    };
  }

  render() {
    return (
      <div>
        <h2>Credit Card Info</h2>
        <div className="ProfileSuccessMessage">{this.state.deletemessage}</div>
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
                  <label htmlFor="fname" className="ProfileFormTest">
                    First name
                  </label>
                  <input
                    type="text"
                    name="fname"
                    value={this.state.ccfName}
                    onChange={this.onChangeFName}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="lname" className="ProfileFormTest">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lname"
                    value={this.state.cclName}
                    onChange={this.onChangeLName}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="number" className="ProfileFormTest">
                    Credit card number
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={this.state.ccnumber}
                    onChange={this.onChangeNumber}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="ccv" className="ProfileFormTest">
                    CCV
                  </label>
                  <input
                    type="text"
                    name="ccv"
                    value={this.state.ccv}
                    onChange={this.onChangeCCV}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="month" className="ProfileFormTest">
                    Month
                  </label>
                  <input
                    type="text"
                    name="month"
                    value={this.state.ccmonth}
                    onChange={this.onChangeMonth}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="year" className="ProfileFormTest">
                    Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={this.state.ccyear}
                    onChange={this.onChangeYear}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="address" className="ProfileFormTest">
                    Billing address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={this.state.ccaddress}
                    onChange={this.onChangeAddress}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="password" className="ProfileFormTest">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={this.state.ccpassword}
                    onChange={this.onChangePassword}
                    className="ProfileInputBox"
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
