import React, { Component } from "react";
import { Button } from "react-bootstrap";
import "./FeedAddressOverlay.css";

export default class FeedAddressOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = { address: "" };
  }

  onChangeAddress = e => {
    this.setState({
      address: e.target.value
    });
  };

  render() {
    return (
      <div className="FeedAddressOverlayBackground">
        <div className="FeedAddressOverlayPopup">
          <h4>Please enter your address</h4>
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
