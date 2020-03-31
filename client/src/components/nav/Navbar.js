import React, { Component } from "react";
import axios from "axios";
import Loader from "../../assets/loader/Loader";
import { getFromStorage } from "../../utils/storage";
import { Navbar, Nav, Button, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    if (window.innerWidth < 1024)
      this.state = {
        mobileview: true,
        isLoaded: false,
        loggedin: false,
        user: []
      };
    else
      this.state = {
        mobileview: false,
        isLoaded: false,
        loggedin: false,
        user: []
      };
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
    window.removeEventListener("resize", this.getMobileView);
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
            <Link to="/search">
              <Button className="navgo" variant="danger">
                >
              </Button>
            </Link>
          </div>
          <Navbar.Collapse className="justify-content-end">
            {this.getLogin()}
          </Navbar.Collapse>
        </Navbar>
        <div className={this.state.mobileview ? "" : "navspacer"} />
      </div>
    );
  }
}
