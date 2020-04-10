//Import libraries
import React, { Component } from "react";
import {
  Navbar,
  Nav,
  Button,
  ButtonToolbar,
  NavDropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";

//Import stylesheets
import "./Navbar.css";

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    if (window.innerWidth < 1024) {
      this.state = {
        mobileview: true,
      };
    } else {
      this.state = {
        mobileview: false,
      };
    }
  }

  //This method sets mobileview to true if the window has
  //a width of less than 1024
  getMobileView = () => {
    if (window.innerWidth < 1024) {
      this.setState({ mobileview: true });
    } else {
      this.setState({ mobileview: false });
    }
  };

  //Add an event lister to call getMobileView when the window is resized
  componentDidMount() {
    window.addEventListener("resize", this.getMobileView, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.getMobileView);
  }

  //This method renders a navbar with different contents depending on whether
  //or not a user is logged in, and if the user is a restaurant owner.
  getLogin = () => {
    if (!this.props.user) {
      return (
        <React.Fragment>
          <Nav.Link as={Link} to="/">
            <div className="linkstyle" style={{ paddingTop: 0 }}>
              MealTime
            </div>
          </Nav.Link>
          <div className="navzone">
            <input
              type="text"
              name="address"
              className="navbox"
              placeholder="Enter your address..."
              style={{ color: "black" }}
            />
            <Link to="/search">
              <Button className="navgo" variant="danger">
                >
              </Button>
            </Link>
          </div>
          <Navbar.Collapse className="justify-content-end">
            <ButtonToolbar>
              <Nav.Link as={Link} to="/login">
                <div className="linkstyle">Log In</div>
              </Nav.Link>
              <Nav.Link as={Link} to="/register">
                <div className="registerbutton">Register</div>
              </Nav.Link>
            </ButtonToolbar>
          </Navbar.Collapse>
        </React.Fragment>
      );
    } else if (this.props.user && !this.props.user.isOwner) {
      return (
        <React.Fragment>
          <Nav.Link as={Link} to="/feed">
            <div className="linkstyle" style={{ paddingTop: 0 }}>
              MealTime
            </div>
          </Nav.Link>
          <div className="navzone">
            <input
              type="text"
              name="address"
              className="navbox"
              defaultValue={this.props.user.address}
              placeholder="Enter your address..."
            />
            <Link to="/search">
              <Button className="navgo" variant="danger">
                >
              </Button>
            </Link>
          </div>
          <Navbar.Collapse className="justify-content-end">
            <ButtonToolbar>
              <div className="NavWelcome">
                Welcome, {this.props.user.firstName}!
              </div>
              <Link to="/account/profile">
                <div className="NavSettings">Settings</div>
              </Link>
              <Link to="/logout">
                <div className="NavLogout">Logout</div>
              </Link>
            </ButtonToolbar>
          </Navbar.Collapse>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Nav.Link as={Link} to="/feed">
            <div className="linkstyle" style={{ paddingTop: 0 }}>
              MealTime
            </div>
          </Nav.Link>
          <div className="navzone">
            <input
              type="text"
              name="address"
              className="navbox"
              defaultValue={this.props.user.address}
              placeholder="Enter your address..."
            />
            <Link to="/search">
              <Button className="navgo" variant="danger">
                >
              </Button>
            </Link>
          </div>
          <Navbar.Collapse className="justify-content-end">
            <ButtonToolbar>
              <div className="NavWelcome" style={{ marginTop: 8 }}>
                Welcome, {this.props.user.firstName}!
              </div>
              <NavDropdown
                title={
                  <span style={{ color: "#add8e6", fontWeight: "bold" }}>
                    Your account
                  </span>
                }
                id="nav-dropdown"
                alignRight
                className="NavSettingsTitle"
              >
                <NavDropdown.Item href="/manage/restaurants">
                  <div className="NavSettingsDropdown">Manage Restaurants</div>
                </NavDropdown.Item>
                <NavDropdown.Item href="/account/profile">
                  <div className="NavSettingsDropdown">Settings</div>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/logout">
                  <div className="NavLogoutDropdown">Logout</div>
                </NavDropdown.Item>
              </NavDropdown>
              {/*
              <Link to="/manage/restaurants">
                <div className="NavSettings">Manage Restaurants</div>
              </Link>
              <Link to="/logout">
                <div className="NavLogout">Logout</div>
              </Link>
              */}
            </ButtonToolbar>
          </Navbar.Collapse>
        </React.Fragment>
      );
    }
  };

  //If mobileview is false, then the navbar will stick to the top of the page.
  render() {
    return (
      <div>
        <Navbar
          fixed={this.state.mobileview ? "" : "top"}
          style={{ backgroundColor: "#2b1d0e" }}
          className="navheader"
        >
          {this.getLogin()}
        </Navbar>
        <div className={this.state.mobileview ? "" : "navspacer"} />
      </div>
    );
  }
}
