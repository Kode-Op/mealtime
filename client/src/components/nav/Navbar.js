import React, { Component } from "react";
import { Navbar, Nav, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default class NavBar extends Component {
  render() {
    return (
      <div>
        <Navbar fixed="top" variant="light">
          <Nav.Link>
            <Link to="/" className="linkstyle">
              MealTime
            </Link>
          </Nav.Link>
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
      </div>
    );
  }
}
