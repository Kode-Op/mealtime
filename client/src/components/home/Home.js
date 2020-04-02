import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import GetLogin from "../../utils/GetLogin";
import Navbar from "../../components/nav/NavbarHomepage";
import Loader from "../../assets/loader/Loader";
import Footer from "../footer/Footer";
import "./Home.css";
import splashplaceholder from "../../assets/images/splash/splashplaceholdershadow.png";
import mobilesplash from "../../assets/images/splash/mobilebackground.png";
import splashcontentplaceholder from "./splashcontentplaceholder.png";
import splashcontentplaceholder500x375 from "./splashcontentplaceholder500x375.png";

export default class Home extends Component {
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
    GetLogin(this.setState.bind(this));
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
    if (this.state.isUserLoaded) {
      if (!this.state.user) {
        return (
          <div>
            <Navbar />
            <div
              className={
                this.state.mobileview
                  ? "splashcontainermobile"
                  : "splashcontainer"
              }
            >
              <img
                src={this.state.mobileview ? mobilesplash : splashplaceholder}
                alt=""
              />
            </div>

            <div
              className={
                this.state.scrolled ? "splashzonesticky" : "splashzone"
              }
            >
              <h1>Any time can be MealTime.</h1>
              <form>
                <input
                  type="text"
                  name="address"
                  className="splashbox"
                  placeholder="Enter your address..."
                />
                <Link to="/search">
                  <Button className="splashgo" variant="danger">
                    >
                  </Button>
                </Link>
              </form>
            </div>
            <div
              className={
                this.state.mobileview ? "splashcontentmobile" : "splashcontent"
              }
            >
              <div className="splashcenterdiv">
                <div className="splashcentercontainer">
                  <div className="splashtrio">
                    <img src={splashcontentplaceholder} alt="" />
                    <h5>Try the app!</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                  <div className="splashtrio">
                    <img src={splashcontentplaceholder} alt="" />
                    <h5>Local favorites</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                  <div className="splashtrio">
                    <img src={splashcontentplaceholder} alt="" />
                    <h5>Become a partner</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                </div>
                <div className="splashcentercontainer">
                  <div className="splashduo">
                    <h5>Pickup or delivery</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                  <div className="splashduo">
                    <img src={splashcontentplaceholder500x375} alt="" />
                  </div>
                </div>
                <div className="splashcentercontainerreverse">
                  <div className="splashduo">
                    <h5>About MealTime</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                  <div className="splashduo">
                    <img src={splashcontentplaceholder500x375} alt="" />
                  </div>
                </div>
              </div>
              <Footer />
            </div>
          </div>
        );
      } else {
        return <Redirect to="/feed" />;
      }
    } else {
      return <Loader />;
    }
  }
}
