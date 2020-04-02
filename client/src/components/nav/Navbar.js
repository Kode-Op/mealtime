//Import libraries
import React, { Component } from "react";
import { Navbar, Nav, Button, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router-dom";

//Import stylesheets
import "./Navbar.css";

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    if (window.innerWidth < 1024) {
      this.state = {
        mobileview: true
      };
    } else {
      this.state = {
        mobileview: false
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
  //or not a user is logged in
  getLogin = () => {
    if (!this.props.user) {
      return (
        <React.Fragment>
          <Nav.Link>
            <Link to="/" className="linkstyle" style={{ paddingTop: 0 }}>
              MealTime
            </Link>
          </Nav.Link>
          <div className="navzone">
            <input
              type="text"
              name="address"
              className="navbox"
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
              <Nav.Link>
                <Link to="/login" className="linkstyle">
                  Log In
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/register">
                  <div className="registerbutton">Register</div>
                </Link>
              </Nav.Link>
            </ButtonToolbar>
          </Navbar.Collapse>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Nav.Link>
            <Link to="/feed" className="linkstyle" style={{ paddingTop: 0 }}>
              MealTime
            </Link>
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
