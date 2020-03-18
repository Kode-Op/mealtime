import React, { Component } from "react";
import { Navbar, Nav, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default class NavBar extends Component {
  componentDidMount() {
    let intViewportWidth = window.innerWidth / 10 + 75;
    window.addEventListener("scroll", () => {
      intViewportWidth = window.innerWidth / 10 + 75;
      isTop = window.scrollY < intViewportWidth;
    });
    window.addEventListener("resize", () => {
      intViewportWidth = window.innerWidth / 10 + 75;
      isTop = window.scrollY < intViewportWidth;
    });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll");
    window.removeEventListener("resize");
  }

  render() {
    return (
      <div>
        <Navbar fixed="top" className="navheader">
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
