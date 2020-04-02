//Import libraries
import React, { Component } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import axios from "axios";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    //Each variable will store the input field values
    this.state = {
      userID: this.props.user._id,
      fName: this.props.user.firstName,
      lName: this.props.user.lastName,
      email: this.props.user.email,
      passwordname: "",
      emailconfirm: "",
      passwordemail: "",
      passwordcurrent: "",
      passwordnew: "",
      passwordnewconfirm: "",
      successMessageName: "",
      successMessageEmail: "",
      successMessagePassword: "",
      errorMessageName: "",
      errorMessageEmail: "",
      errorMessagePassword: ""
    };
  }

  //Event handlers for each form field
  onChangeFName = e => {
    this.setState({
      fName: e.target.value
    });
  };
  onChangeLName = e => {
    this.setState({
      lName: e.target.value
    });
  };
  onChangePasswordName = e => {
    this.setState({
      passwordname: e.target.value
    });
  };
  onChangeEmail = e => {
    this.setState({
      email: e.target.value
    });
  };
  onChangeEmailConfirm = e => {
    this.setState({
      emailconfirm: e.target.value
    });
  };
  onChangePasswordEmail = e => {
    this.setState({
      passwordemail: e.target.value
    });
  };
  onChangePasswordCurrent = e => {
    this.setState({
      passwordcurrent: e.target.value
    });
  };
  onChangePasswordNew = e => {
    this.setState({
      passwordnew: e.target.value
    });
  };
  onChangePasswordNewConfirm = e => {
    this.setState({
      passwordnewconfirm: e.target.value
    });
  };

  //Event handlers for when the user submits the forms on the page
  onSubmitName = e => {
    let pkg = {
      firstName: this.state.fName,
      lastName: this.state.lName,
      password: this.state.passwordname
    };

    axios
      .post("/api/users/updateName/" + this.state.userID, pkg)
      .then(() => {
        this.setState({
          errorMessageName: "",
          successMessageName: "Successfully updated name!"
        });
      })
      .catch(error => {
        if (error.response.status === 404) {
          this.setState({
            errorMessageName:
              "404 user not found. Please refresh page and try again.",
            successMessageName: ""
          });
        } else if (error.response.status === 500) {
          this.setState({
            errorMessageName: "Error! Invalid password",
            successMessageName: ""
          });
        } else {
          this.setState({
            errorMessageName:
              "400 internal server error. Please try again later.",
            successMessageName: ""
          });
        }
      });
    e.preventDefault();
  };

  onSubmitEmail(e) {
    if (this.validateEmail()) {
      let pkg = {
        email: this.state.email,
        password: this.state.passwordemail
      };
      axios
        .post("/api/users/updateEmail/" + this.state.userID, pkg)
        .then(response => {
          this.setState({
            errorMessageEmail: "",
            successMessageEmail: "Successfully updated email!"
          });
        })
        .catch(error => {
          if (error.response.status === 404) {
            this.setState({
              errorMessageEmail:
                "404 user not found. Please refresh page and try again.",
              successMessageEmail: ""
            });
          } else if (error.response.status === 500) {
            this.setState({
              errorMessageEmail: "Error! Invalid password",
              successMessageEmail: ""
            });
          } else {
            this.setState({
              errorMessageEmail:
                "400 internal server error. Please try again later.",
              successMessageEmail: ""
            });
          }
        });
    }
    e.preventDefault();
  }

  onSubmitPassword(e) {
    if (this.validatePassword()) {
      let pkg = {
        oldPassword: this.state.passwordcurrent,
        newPassword: this.state.passwordnew
      };
      axios
        .post("/api/users/updatePassword/" + this.state.userID, pkg)
        .then(() => {
          this.setState({
            errorMessagePassword: "",
            successMessagePassword: "Successfully updated password!"
          });
        })
        .catch(error => {
          if (error.response.status === 404) {
            this.setState({
              errorMessagePassword:
                "404 user not found. Please refresh page and try again.",
              successMessagePassword: ""
            });
          } else if (error.response.status === 500) {
            this.setState({
              errorMessagePassword: "Error! Invalid current password",
              successMessagePassword: ""
            });
          } else {
            this.setState({
              errorMessagePassword:
                "400 internal server error. Please try again later.",
              successMessagePassword: ""
            });
          }
        });
    }
    e.preventDefault();
  }

  //This helper function verifies that the email address is in the format email@website.domain
  validateEmail = () => {
    //Regular expression courtesy of https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const emailVerification = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let errorMessage = "";

    if (
      !emailVerification.test(this.state.email) ||
      !emailVerification.test(this.state.emailconfirm)
    ) {
      errorMessage = "You must enter a valid email address. \n";
    }

    if (this.state.email !== this.state.emailconfirm) {
      errorMessage = errorMessage.concat("Your emails must match. \n");
    }

    if (errorMessage) {
      this.setState({ errorMessageEmail: errorMessage });
      return false;
    }
    this.setState({ errorMessageEmail: "" });
    return true;
  };

  //This helper function verifies that the new password is in the correct format.
  validatePassword = () => {
    let errorMessage = "";
    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;

    if (this.state.passwordnew !== this.state.passwordnewconfirm) {
      errorMessage = errorMessage.concat("Your new passwords must match. \n");
    }
    if (this.state.passwordnew.length < 8) {
      errorMessage = errorMessage.concat(
        "Your new password must contain at least 8 characters. \n"
      );
    }
    if (!lowerCaseLetters.test(this.state.passwordnew)) {
      errorMessage = errorMessage.concat(
        "Your new password must contain lowercase letters. \n"
      );
    }
    if (!upperCaseLetters.test(this.state.passwordnew)) {
      errorMessage = errorMessage.concat(
        "Your new password must contain uppercase letters. \n"
      );
    }
    if (!numbers.test(this.state.passwordnew)) {
      errorMessage = errorMessage.concat(
        "Your new password must contain numbers. \n"
      );
    }
    if (errorMessage) {
      this.setState({ errorMessagePassword: errorMessage });
      return false;
    }
    return true;
  };

  render() {
    return (
      <div>
        <h2>Profile</h2>
        <Accordion>
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="0"
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Name:</div>
              <div className="ProfileUserInfo">
                {this.state.fName} {this.state.lName}
              </div>
              <div className="ProfileEditLink">Edit</div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <h5>Edit name</h5>
                <br />
                <form onSubmit={this.onSubmitName}>
                  <label htmlFor="fname" className="ProfileFormTest">
                    First name
                  </label>
                  <input
                    type="text"
                    name="fname"
                    value={this.state.fName}
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
                    value={this.state.lName}
                    onChange={this.onChangeLName}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="passwordname" className="ProfileFormTest">
                    Password
                  </label>
                  <input
                    type="password"
                    name="passwordname"
                    value={this.state.passwordname}
                    onChange={this.onChangePasswordName}
                    className="ProfileInputBox"
                    required
                  />
                  <div className="ProfileErrorMessage">
                    {this.state.errorMessageName}
                  </div>
                  <div className="ProfileSuccessMessage">
                    {this.state.successMessageName}
                  </div>
                  <Button variant="success" type="submit">
                    Update name
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
              <div className="ProfileHeaderLeft">Email:</div>
              <div className="ProfileUserInfo">{this.state.email}</div>
              <div className="ProfileEditLink">Edit</div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <h5>Edit email</h5>
                <br />
                <form onSubmit={this.onSubmitEmail}>
                  <label htmlFor="email" className="ProfileFormTest">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="emailconfirm" className="ProfileFormTest">
                    Confirm email
                  </label>
                  <input
                    type="text"
                    name="emailconfirm"
                    value={this.state.emailconfirm}
                    onChange={this.onChangeEmailConfirm}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="passwordemail" className="ProfileFormTest">
                    Password
                  </label>
                  <input
                    type="password"
                    name="passwordemail"
                    value={this.state.passwordemail}
                    onChange={this.onChangePasswordEmail}
                    className="ProfileInputBox"
                    required
                  />
                  <div className="ProfileErrorMessage">
                    {this.state.errorMessageEmail}
                  </div>
                  <div className="ProfileSuccessMessage">
                    {this.state.successMessageEmail}
                  </div>
                  <Button variant="success" type="submit">
                    Update email
                  </Button>
                </form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="2"
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Password:</div>
              <div className="ProfileUserInfo">•••••••••••••••</div>
              <div className="ProfileEditLink">Edit</div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <h5>Edit password</h5>
                <br />
                <form onSubmit={this.onSubmitPassword}>
                  <label htmlFor="passwordcurrent" className="ProfileFormTest">
                    Current password
                  </label>
                  <input
                    type="password"
                    name="passwordcurrent"
                    value={this.state.passwordcurrent}
                    onChange={this.onChangePasswordCurrent}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="passwordnew" className="ProfileFormTest">
                    New password
                  </label>
                  <input
                    type="password"
                    name="passwordnew"
                    value={this.state.passwordnew}
                    onChange={this.onChangePasswordNew}
                    className="ProfileInputBox"
                    required
                  />
                  <label
                    htmlFor="passwordnewconfirm"
                    className="ProfileFormTest"
                  >
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    name="passwordnewconfirm"
                    value={this.state.passwordnewconfirm}
                    onChange={this.onChangePasswordNewConfirm}
                    className="ProfileInputBox"
                    required
                  />
                  <div className="ProfileErrorMessage">
                    {this.state.errorMessagePassword}
                  </div>
                  <div className="ProfileSuccessMessage">
                    {this.state.successMessagePassword}
                  </div>
                  <Button variant="success" type="submit">
                    Update password
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
