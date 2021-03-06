//Import Libraries
import React, { Component } from "react";
import { Button, Accordion, Card } from "react-bootstrap";

//Import utilities
import {
  UpdateUserAddress,
  UpdateUserPhoneNumber,
} from "../../../utils/axios/Users";

export default class Address extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    //Each variable will store the input field values
    this.state = {
      address: this.props.user.address,
      phone: this.props.user.phone,
      passwordphone: "",
      errorMessage: "",
      successMessage: "",
      errorMessagePhone: "",
      successMessagePhone: "",
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //Event handlers for each form field
  onChangeAddress = (e) => {
    if (this._isMounted) {
      this.setState({
        address: e.target.value,
      });
    }
  };
  onChangePhone = (e) => {
    if (this._isMounted) {
      this.setState({
        phone: e.target.value,
      });
    }
  };
  onChangePasswordPhone = (e) => {
    if (this._isMounted) {
      this.setState({
        passwordphone: e.target.value,
      });
    }
  };

  //Event handlers for when the user submits the forms on the page
  onSubmitAddress = (e) => {
    let pkg = {
      address: this.state.address,
    };

    /*address update*/
    UpdateUserAddress(this.props.user._id, pkg)
      .then(() => {
        if (this._isMounted) {
          this.setState({
            errorMessage: "",
            successMessage: "Successfully updated address!",
          });
        }
      })
      .catch((error) => {
        if (this._isMounted) {
          if (error.response.status === 404) {
            this.setState({
              errorMessage:
                "404 user not found. Please refresh page and try again.",
              successMessage: "",
            });
          } else {
            this.setState({
              errorMessage:
                "400 internal server error. Please try again later.",
              successMessage: "",
            });
          }
        }
      });
    e.preventDefault();
  };

  onSubmitPhone = (e) => {
    if (this.phoneValidation()) {
      let pkg = {
        phone: this.state.phone,
        password: this.state.passwordphone,
      };

      /*Phone number update*/
      UpdateUserPhoneNumber(this.props.user._id, pkg)
        .then(() => {
          if (this._isMounted) {
            this.setState({
              errorMessagePhone: "",
              successMessagePhone: "Successfully updated phone!",
            });
          }
        })
        .catch((error) => {
          if (this._isMounted) {
            if (error.response.status === 404) {
              this.setState({
                errorMessagePhone:
                  "404 user not found. Please refresh page and try again.",
                successMessagePhone: "",
              });
            } else if (error.response.status === 500) {
              this.setState({
                errorMessagePhone: "Error! Invalid password",
                successMessagePhone: "",
              });
            } else {
              this.setState({
                errorMessagePhone:
                  "400 internal server error. Please try again later.",
                successMessagePhone: "",
              });
            }
          }
        });
      this.setState({
        passwordphone: "",
      });
    }
    e.preventDefault();
  };

  //This helper function verifies that the phone number has the format 5551234567
  phoneValidation = () => {
    let errorMessage = "";

    if (this.state.phone.length !== 10) {
      errorMessage = errorMessage.concat(
        "Your phone must be 10 characters in length.\n"
      );
    }
    if (isNaN(this.state.phone)) {
      errorMessage = errorMessage.concat(
        "Your phone number must only contain numbers.\n"
      );
    }
    if (errorMessage && this._isMounted) {
      this.setState({ errorMessagePhone: errorMessage });
      return false;
    }
    return true;
  };

  render() {
    return (
      <div>
        <h2>Address and phone</h2>
        <Accordion>
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="0"
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Address: </div>
              <div className="ProfileUserInfo">{this.state.address}</div>
              <div className="ProfileEditLink">Add/Edit</div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <form onSubmit={this.onSubmitAddress}>
                  <label htmlFor="address" className="ProfileFormTest">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={this.state.address}
                    onChange={this.onChangeAddress}
                    className="ProfileInputBox"
                    required
                  />
                  <div className="ProfileErrorMessage">
                    {this.state.errorMessage}
                  </div>
                  <div className="ProfileSuccessMessage">
                    {this.state.successMessage}
                  </div>
                  <Button variant="success" type="submit">
                    Add/update address
                  </Button>
                </form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="1"
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Phone: </div>
              <div className="ProfileUserInfo">{this.state.phone}</div>
              <div className="ProfileEditLink">Add/Edit</div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <form onSubmit={this.onSubmitPhone}>
                  <label htmlFor="phone" className="ProfileFormTest">
                    Phone
                  </label>
                  <input
                    type="phone"
                    name="address"
                    maxLength="10"
                    value={this.state.phone}
                    onChange={this.onChangePhone}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="passwordphone" className="ProfileFormTest">
                    Password
                  </label>
                  <input
                    type="password"
                    name="passwordphone"
                    value={this.state.passwordphone}
                    onChange={this.onChangePasswordPhone}
                    className="ProfileInputBox"
                    required
                  />
                  <div className="ProfileErrorMessage">
                    {this.state.errorMessagePhone}
                  </div>
                  <div className="ProfileSuccessMessage">
                    {this.state.successMessagePhone}
                  </div>
                  <Button variant="success" type="submit">
                    Add/update phone
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
