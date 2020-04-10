//Import libraries
import React, { Component } from "react";
import { Navbar, Nav, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router-dom";

//Import stylesheets
import "./Navbar.css";

export default class NavbarHomepage extends Component {
  constructor(props) {
    super(props);

    if (window.innerWidth < 1024)
      this.state = {
        mobileview: true,
        opacity: 0,
      };
    else
      this.state = {
        mobileview: false,
        opacity: 0,
      };
  }

  /*
    This method sets the opacity of the navbar to be proportional to the
    window scroll height between the bottom of the splash screen and 75
    pixels up from it. This allows the navbar to fade in as you scroll
    down the page.
  */
  getOpacity = () => {
    const range = 75;
    let intViewport = window.scrollY;
    let bottomHeight = window.innerWidth / 3.310344827586207 - 80;
    if (window.innerWidth >= 1024) {
      let calc = (intViewport - bottomHeight + range) / range;
      if (calc > 1) calc = 1;
      else if (calc < 0) calc = 0;
      this.setState({ opacity: calc, mobileview: true });
    } else {
      this.setState({ opacity: 0, mobileview: false });
    }
  };

  componentDidMount() {
    //Add event listeners
    window.addEventListener("scroll", this.getOpacity, false);
    window.addEventListener("resize", this.getOpacity, false);
  }

  componentWillUnmount() {
    //Remove event listeners
    window.removeEventListener("scroll", this.getOpacity);
    window.removeEventListener("resize", this.getOpacity);
  }

  render() {
    return (
      <div>
        <div
          style={{ opacity: this.state.opacity, backgroundColor: "#2b1d0e" }}
          className="navheader"
        />
        <Navbar
          fixed={this.state.mobileview ? "top" : ""}
          style={
            this.state.user === "undefined"
              ? { paddingTop: 0 }
              : { paddingTop: 16 }
          }
        >
          <div style={{ marginTop: -8 }}>
            <Nav.Link as={Link} to="/">
              <div className="linkstyle" style={{ paddingTop: 0 }}>
                MealTime
              </div>
            </Nav.Link>
          </div>
          <Navbar.Collapse className="justify-content-end">
            <ButtonToolbar>
              <div style={{ marginTop: -3 }}>
                <Nav.Link as={Link} to="/login">
                  <div className="linkstyle">Log In</div>
                </Nav.Link>
              </div>
              <div style={{ marginTop: -3 }}>
                <Nav.Link as={Link} to="/register">
                  <div className="registerbutton">Register</div>
                </Nav.Link>
              </div>
            </ButtonToolbar>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
