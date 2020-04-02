import React, { Component } from "react";
import { Navbar, Nav, Button, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router-dom";
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

  getMobileView = () => {
    if (window.innerWidth < 1024) {
      this.setState({ mobileview: true });
    } else {
      this.setState({ mobileview: false });
    }
  };

  componentDidMount() {
    window.addEventListener("resize", this.getMobileView, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.getMobileView);
  }

  getLogin() {
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
  }

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
