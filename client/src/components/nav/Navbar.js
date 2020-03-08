import React, { Component } from "react";
import { Navbar, Nav, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css"

export default class NavBar extends Component {
  render() {
    return (
      <div>
        <Navbar fixed="top" variant="light" className="navcontainer">
          <Navbar.Brand>MealTime</Navbar.Brand>
          <Nav.Link>
            <Link to="/" className="linkstyle">Home</Link>
          </Nav.Link>
          <Nav.Link>
            <Link to="/data" className="linkstyle">Data</Link>
          </Nav.Link>
          <Navbar.Collapse className="justify-content-end">
            <ButtonToolbar>
              <Nav.Link>
                <div className="loginbutton">
                  <Link to="/login" className="linkstyle">Log In</Link>
                </div>
              </Nav.Link>
              <Nav.Link>
                <div className="registerbutton">
                  <Link to="/register" className="linkstyle">Register </Link>
                </div>
              </Nav.Link>
            </ButtonToolbar>
          </Navbar.Collapse>
        </Navbar>
        </div>
    );
  }
}