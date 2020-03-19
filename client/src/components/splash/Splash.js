import React, { Component } from "react";
import { Button } from "react-bootstrap";
import "./Splash.css";
import splashplaceholder from "./splashplaceholdershadow.png";
import mobilesplash from "./mobilebackground.png";

export default class Splash extends Component {
  constructor() {
    super();
    this.state = {
      scrolled: false
    };
    if (window.innerWidth < 1024)
      this.state = { mobileview: true, smallscreendesktop: false };
    else if (window.innerWidth < 1366)
      this.state = { mobileview: false, smallscreendesktop: true };
    else this.state = { mobileview: false, smallscreendesktop: false };
  }

  getScrollState = () => {
    let intViewportWidth;
    this.state.smallscreendesktop
      ? (intViewportWidth = window.innerWidth / 8 + 30)
      : (intViewportWidth = window.innerWidth / 10 + 75);
    let isTop = window.scrollY < intViewportWidth;

    if (window.innerWidth < 1024) {
      this.setState({ mobileview: true, scrolled: false });
    } else {
      this.setState({ mobileview: false });
      if (isTop !== true) {
        this.setState({ scrolled: true });
      } else {
        this.setState({ scrolled: false });
      }
    }
  };

  componentDidMount() {
    //Force each splash image to preload
    new Image().src = mobilesplash;
    new Image().src = splashplaceholder;

    window.addEventListener("scroll", this.getScrollState, false);
    window.addEventListener("resize", this.getScrollState, false);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.getScrollState);
    window.removeEventListener("resize", this.getScrollState);
  }

  render() {
    return (
      <React.Fragment>
        <div
          className={
            this.state.mobileview ? "splashcontainermobile" : "splashcontainer"
          }
        >
          <img
            src={this.state.mobileview ? mobilesplash : splashplaceholder}
            alt=""
          />
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
        <div style={{ height: 500 }} />
      </React.Fragment>
    );
  }
}
