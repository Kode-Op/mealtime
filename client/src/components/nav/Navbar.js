import React, { Component } from "react";
import { Navbar, Nav, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    if (window.innerWidth < 1024) this.state = { mobileview: true, opacity: 0 };
    else this.state = { mobileview: false, opacity: 0 };
  }

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
    window.addEventListener("scroll", this.getOpacity, false);
    window.addEventListener("resize", this.getOpacity, false);
  }

  componentWillUnmount() {
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
        <Navbar fixed={this.state.mobileview ? "top" : ""}>
          <Nav.Link>
            <Link to="/" className="linkstyle" style={{ paddingTop: 0 }}>
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
