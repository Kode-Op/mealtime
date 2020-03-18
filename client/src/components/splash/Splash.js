import React, { Component } from "react";
import { Button } from "react-bootstrap";
import "./Splash.css";
import splashplaceholder from "./splashplaceholdershadow.png";

export default class Splash extends Component {
  constructor() {
    super();
    this.state = {
      scrolled: false
    };
  }

  componentDidMount() {
    let intViewportWidth = window.innerWidth / 10 + 75;
    let isTop = window.scrollY < intViewportWidth;
    window.addEventListener("scroll", () => {
      intViewportWidth = window.innerWidth / 10 + 75;
      isTop = window.scrollY < intViewportWidth;
      if (isTop !== true) {
        this.setState({ scrolled: true });
      } else {
        this.setState({ scrolled: false });
      }
    });
    window.addEventListener("resize", () => {
      intViewportWidth = window.innerWidth / 10 + 75;
      isTop = window.scrollY < intViewportWidth;
      if (isTop !== true) {
        this.setState({ scrolled: true });
      } else {
        this.setState({ scrolled: false });
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll");
    window.removeEventListener("resize");
  }

  render() {
    return (
      <React.Fragment>
        <div className="splashcontainer">
          <img src={splashplaceholder} alt="" />
        </div>

        <div
          className={this.state.scrolled ? "splashzonesticky" : "splashzone"}
        >
          <h1>Any time can be MealTime.</h1>
          <form>
            <input
              type="text"
              name="address"
              className="splashbox"
              placeholder="Enter your address..."
            />
            <Button className="splashgo" variant="danger">
              >
            </Button>
          </form>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </React.Fragment>
    );
  }
}
