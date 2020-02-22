import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import "./Navbar.css";

export default class NavBar extends Component {
  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>MealTime</Navbar.Brand>
          <Nav.Link className="navLink">Home</Nav.Link>
          <Nav.Link className="navLink">Data</Nav.Link>
        </Navbar>
      </div>
    );
  }
}
