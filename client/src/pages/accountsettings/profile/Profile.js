import React, { Component } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import "./Profile.css";
import axios from "axios";

function EditButton() {
  return <div className="ProfileEditLink">Edit</div>;
}

const initialState = {
  fname: "Firstname",
  lname: "Lastname",
  passwordname: "",
  email: "",
  emailconfirm: "",
  passwordemail: "",
  passwordcurrent: "",
  passwordnew: "",
  passwordnewconfirm: "",
  errorMessageName: "",
  errorMessageEmail: "",
  errorMessagePassword: "",
  nameRedirect: false,
  emailRedirect: false,
  passwordRedirect: false
};

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.onChangeFName = this.onChangeFName.bind(this);
    this.onChangeLName = this.onChangeLName.bind(this);
    this.onChangePasswordName = this.onChangePasswordName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeEmailConfirm = this.onChangeEmailConfirm.bind(this);
    this.onChangePasswordEmail = this.onChangePasswordEmail.bind(this);
    this.onChangePasswordCurrent = this.onChangePasswordCurrent.bind(this);
    this.onChangePasswordNew = this.onChangePasswordNew.bind(this);
    this.onChangePasswordNewConfirm = this.onChangePasswordNewConfirm.bind(
      this
    );
    this.onSubmitName = this.onSubmitName.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);

    this.state = initialState;
  }

  onChangeFName(e) {
    this.setState({
      fname: e.target.value
    });
  }
  onChangeLName(e) {
    this.setState({
      lname: e.target.value
    });
  }
  onChangePasswordName(e) {
    this.setState({
      passwordname: e.target.value
    });
  }
  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }
  onChangeEmailConfirm(e) {
    this.setState({
      emailconfirm: e.target.value
    });
  }
  onChangePasswordEmail(e) {
    this.setState({
      passwordemail: e.target.value
    });
  }
  onChangePasswordCurrent(e) {
    this.setState({
      passwordcurrent: e.target.value
    });
  }
  onChangePasswordNew(e) {
    this.setState({
      passwordnew: e.target.value
    });
  }
  onChangePasswordNewConfirm(e) {
    this.setState({
      passwordnewconfirm: e.target.value
    });
  }

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
    return true;
  };

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

  onSubmitName(e) {
    console.log("Calling updateName");
    let userId = "5e7cefead6465054f8dc9d9f"; //this.state.userId;
    let pkg = {
      firstName: "Rachelle", //this.state.fname,
      lastName: "Sharer", //this.state.lname,
      password: "P@ssword1" //this.state.passwordname
    };
    axios
      .post("/api/users/updateName/" + userId, pkg)
      .then(response => {
        if (response.status === 200) {
          console.log("Successful Name Change");
        } else if (response.status === 404) {
          console.log("404: User not found. Check userId");
        } else if (response.status === 500) {
          console.log("500: Invalid Password");
        } else {
          console.log("400: Error saving name (server error)");
        }
        this.setState({ isLoaded: true });
      })
      .catch(error => {
        console.log("Error: " + error);
        this.setState({ isLoaded: true });
      });
    e.preventDefault();
    this.setState({ nameRedirect: true });
  }

  onSubmitEmail(e) {
    console.log("Calling updateEmail");
    let userId = "5e7cefead6465054f8dc9d9f"; //this.state.userId;
    let pkg = {
      email: "testuser25@gmail.com", //this.state.email,
      password: "P@ssword1" //this.state.passwordemail
    };
    axios
      .post("/api/users/updateEmail/" + userId, pkg)
      .then(response => {
        if (response.status === 200) {
          console.log("Successful Email Change");
        } else if (response.status === 404) {
          console.log("404: User not found. Check userId");
        } else if (response.status === 500) {
          console.log("500: Invalid Password");
        } else {
          console.log("400: Error saving email (server error)");
        }
        this.setState({ isLoaded: true });
      })
      .catch(error => {
        console.log("Error: " + error);
        this.setState({ isLoaded: true });
      });
    e.preventDefault();
    if (this.validateEmail()) this.setState({ emailRedirect: true });
  }

  onSubmitPassword(e) {
    console.log("Calling updatePassword");
    let userId = "5e7cefead6465054f8dc9d9f"; //this.state.userId;
    let pkg = {
      oldPassword: "P@ssword2", //this.state.passwordcurrent,
      newPassword: "P@ssword1" //this.state.passwordnew
    };
    axios
      .post("/api/users/updatePassword/" + userId, pkg)
      .then(response => {
        if (response.status === 200) {
          console.log("Successful Password Change");
        } else if (response.status === 404) {
          console.log("404: User not found. Check userId");
        } else if (response.status === 500) {
          console.log("500: Invalid Current Password");
        } else {
          console.log("400: Error saving password (server error)");
        }
        this.setState({ isLoaded: true });
      })
      .catch(error => {
        console.log("Error: " + error);
        this.setState({ isLoaded: true });
      });
    e.preventDefault();
    if (this.validatePassword()) this.setState({ passwordRedirect: true });
  }

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
              <div className="ProfileUserInfo">Firstname Lastname</div>
              <EditButton />
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
                    value={this.state.fname}
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
                    value={this.state.lname}
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
              <div className="ProfileUserInfo">example@email.com</div>
              <EditButton />
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
              <EditButton />
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
