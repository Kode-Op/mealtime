import React, { Component } from "react";
import { Navbar, Nav, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getFromStorage } from "../../utils/storage";
import axios from "axios";
import Loader from "../../assets/loader/Loader";
import "./Navbar.css";

export default class NavbarHomepage extends Component {
  constructor(props) {
    super(props);
    if (window.innerWidth < 1024)
      this.state = {
        mobileview: true,
        opacity: 0,
        isLoaded: false,
        loggedin: false,
        user: []
      };
    else
      this.state = {
        mobileview: false,
        opacity: 0,
        isLoaded: false,
        loggedin: false,
        user: []
      };
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
    //Add event listeners
    window.addEventListener("scroll", this.getOpacity, false);
    window.addEventListener("resize", this.getOpacity, false);

    //Check to see if logged in
    const obj = getFromStorage("mealtime");
    let token = "";
    if (obj !== null) {
      token = obj.token;
      // Verify token
      axios
        .get("/api/users/verify/" + token)
        .then(tokenResponse => {
          if (tokenResponse.data.success) {
            axios
              .get("/api/users/getUser/" + token)
              .then(userResponse => {
                axios
                  .get("/api/users/" + userResponse.data.userId)
                  .then(idResponse => {
                    this.setState({
                      user: idResponse.data,
                      loggedin: true,
                      isLoaded: true
                    });
                  })
                  .catch(error => {
                    this.setState({ isLoaded: true, loggedin: false });
                    console.log("Error in getting /api/users: " + error);
                  });
              })
              .catch(error => {
                this.setState({ isLoaded: true, loggedin: false });
                console.log("Error in getting /api/users/getUser: " + error);
              });
          } else {
            this.setState({ isLoaded: true, loggedin: false });
            console.log("Error in getting /api/users/verify");
          }
        })
        .catch(error => {
          this.setState({ isLoaded: true, loggedin: false });
          console.log(error);
        });
    } else {
      this.setState({ isLoaded: true, loggedin: false });
      console.log("User isn't logged in");
    }
  }

  componentWillUnmount() {
    //Remove event listeners
    window.removeEventListener("scroll", this.getOpacity);
    window.removeEventListener("resize", this.getOpacity);
  }

  getLogin() {
    if (this.state.isLoaded) {
      if (!this.state.loggedin) {
        return (
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
        );
      } else {
        return (
          <ButtonToolbar>
            <div className="NavWelcome">
              Welcome, {this.state.user.firstName}!
            </div>
            <Link to="/account/profile">
              <div className="NavSettings">Settings</div>
            </Link>
            <Link to="/logout">
              <div className="NavLogout">Logout</div>
            </Link>
          </ButtonToolbar>
        );
      }
    } else {
      return (
        <div style={{ float: "right" }}>
          <Loader />
        </div>
      );
    }
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
          <Nav.Link>
            <Link to="/" className="linkstyle" style={{ paddingTop: 0 }}>
              MealTime
            </Link>
          </Nav.Link>
          <Navbar.Collapse className="justify-content-end">
            {this.getLogin()}
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
