//Import libraries
import React, { Component } from "react";
import { Button } from "react-bootstrap";

//Import stylesheets
import "./FeedAddressOverlay.css";

//This class renders a popup text box that asks the user for the address if
//no address is associated with the user's account
export default class FeedAddressOverlay extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      address: "",
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //Event handler for changing the address
  onChangeAddress = (e) => {
    if (this._isMounted) {
      this.setState({
        address: e.target.value,
      });
    }
  };

  render() {
    return (
      <div className="FeedAddressOverlayBackground">
        <div className="FeedAddressOverlayPopup">
          <h4>Please enter your address</h4>

          {/*
            After pressing "Let's eat", the address variable will be passed as
            an argument to the updateAddressHandler method found in the parent
            component, Feed.js
          */}

          <form
            onSubmit={() => this.props.updateAddressHandler(this.state.address)}
          >
            <input
              type="text"
              name="address"
              value={this.state.address}
              onChange={this.onChangeAddress}
              className="FeedAddressOverlayInputBox"
              required
            />
            <Button variant="success" type="submit">
              Let's eat
            </Button>
          </form>
        </div>
      </div>
    );
  }
}
