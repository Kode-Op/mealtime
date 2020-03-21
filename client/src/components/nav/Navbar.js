import React, { Component } from "react";
import { Navbar, Nav, Button, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    if (window.innerWidth < 1024) {
      this.state = { mobileview: true };
    } else {
      this.state = { mobileview: false };
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

  render() {
    return (
      <div>
        <Navbar
          fixed={this.state.mobileview ? "" : "top"}
          style={{ backgroundColor: "#2b1d0e" }}
          className="navheader"
        >
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
            <Button className="navgo" variant="danger">
              >
            </Button>
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
        </Navbar>
        <div className={this.state.mobileview ? "" : "navspacer"} />
      </div>
    );
  }
}
