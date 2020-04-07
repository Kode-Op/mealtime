//Import libraries
import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";

//Import components
import Navbar from "../nav/NavbarHomepage";
import Footer from "../footer/Footer";

//Import assets
import Loader from "../../assets/loader/Loader";
import appimage from "../../assets/images/splash/app_image.PNG";
import localimage from "../../assets/images/splash/local_image.PNG";
import partnerimage from "../../assets/images/splash/partner_image.PNG";
import aboutimage from "../../assets/images/splash/about_image.jpg";
import pickupimage from "../../assets/images/splash/pickup_image.jpg";
import splashplaceholder from "../../assets/images/splash/splashplaceholdershadow.png";
import mobilesplash from "../../assets/images/splash/mobilebackground.png";
import splashcontentplaceholder from "./splashcontentplaceholder.png";
import splashcontentplaceholder500x375 from "./splashcontentplaceholder500x375.png";

//Import utilities
import GetLogin from "../../utils/GetLogin";

//Import stylesheets
import "./Home.css";

export default class Home extends Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      scrolled: false,
    };

    //Set the "mobileview" and "smallscreendesktop" variables based on the
    //initial width of the window
    if (window.innerWidth < 1024) {
      this.state = { mobileview: true, smallscreendesktop: false };
    } else if (window.innerWidth < 1366) {
      this.state = { mobileview: false, smallscreendesktop: true };
    } else {
      this.state = { mobileview: false, smallscreendesktop: false };
    }
  }

  /*  
      This method sets the "scrolled" variable to true is the top of the
      window surpasses the "Enter your address" input field. This is used
      to make it stick to the top of the screen after it's surpassed. This
      method also recalculates "mobileview" and "smallscreendesktop" when
      the window is either being scrolled or resized
  */
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
    this._isMounted = true;

    //Force each splash image to preload
    new Image().src = mobilesplash;
    new Image().src = splashplaceholder;

    //Trigger the getScrollState method when the window is either being scrolled or resized
    window.addEventListener("scroll", this.getScrollState, false);
    window.addEventListener("resize", this.getScrollState, false);

    //Get "user" and "isUserLoaded" from the GetLogin utility
    GetLogin()
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            isUserLoaded: true,
            user: response,
          });
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            isUserLoaded: true,
          });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;

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
                    <img src={appimage} alt={splashcontentplaceholder} />
                    <h5>Try the app!</h5>
                    <p>
                      Get the best experience possible with our mobile Android
                      app!
                    </p>
                  </div>
                  <div className="splashtrio">
                    <img src={localimage} alt={splashcontentplaceholder} />
                    <h5>Local favorites</h5>
                    <p>
                      Bring every local flavor that you crave, right to your
                      doorstep with Mealtime.
                    </p>
                  </div>
                  <div className="splashtrio">
                    <img src={partnerimage} alt={splashcontentplaceholder} />
                    <h5>Become a partner</h5>
                    <p>
                      Grow your business and reach customers like never before
                      by partnering with Mealtime.
                    </p>
                  </div>
                </div>
                <div className="splashcentercontainer">
                  <div className="splashduo">
                    <h5>Pickup or delivery</h5>
                    <p>
                      Get it delivered right to your door. Or, try pickup on
                      your way home. It’s Mealtime on your time!
                    </p>
                  </div>
                  <div className="splashduo">
                    <img
                      src={pickupimage}
                      alt={splashcontentplaceholder500x375}
                    />
                  </div>
                </div>
                <div className="splashcentercontainerreverse">
                  <div className="splashduo">
                    <h5>About MealTime</h5>
                    <p>
                      Mealtime is a new way to get meals on your own time. With
                      powerful filters that cater to your personal tastes and
                      preferences, finding great and affordable eats have never
                      been easier. Any time can be Mealtime!
                    </p>
                  </div>
                  <div className="splashduo">
                    <img
                      src={aboutimage}
                      alt={splashcontentplaceholder500x375}
                    />
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
