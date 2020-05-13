//Import libraries
import React, { Component } from "react";
import { Button } from "react-bootstrap";

//Import utilities
import TagBank from "../../utils/Tags";

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
      preferencesPopup: false,
      tagbank: TagBank,
      tags: [],
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

  //This method adds a tag to the tag array in the state.
  addTag = (index) => {
    if (this._isMounted) {
      this.setState({
        tags: [...this.state.tags, index],
      });
    }
  };

  //This method removes a tag from the tag array in the state.
  removeTag = (i) => {
    if (this.state.tags.length > 0) {
      let tags = this.state.tags;
      let index = tags.indexOf(i);
      if (index !== -1) {
        tags.splice(index, 1);
        if (this._isMounted) {
          this.setState({
            tags: tags,
          });
        }
      }
    }
  };

  //This method obtains and styles the tag bank, applying a different style to
  //those already included in the tags
  getTagBank = () => {
    let rows = [];
    this.state.tagbank.forEach((item, i) => {
      if (!this.state.tags.includes(i)) {
        rows.push(
          <div
            key={i}
            className="FeedAddressOverlayTagItem"
            onClick={() => this.addTag(i)}
          >
            {item}
          </div>
        );
      } else {
        rows.push(
          <div
            key={i}
            className="ManageRestaurantTagItemSelected"
            onClick={() => this.removeTag(i)}
          >
            {item}
          </div>
        );
      }
    });
    return rows;
  };

  //This method obtains and styles the applied tags.
  getTagList = () => {
    let rows = [];
    this.state.tags.forEach((item, i) => {
      rows.push(
        <div
          key={i}
          className="FeedAddressOverlayTagItemSelected"
          onClick={() => this.removeTag(item)}
        >
          {this.state.tagbank[item]}
        </div>
      );
    });
    return rows;
  };

  //This method either renders the add address popup or the add preferences popup
  //depending on whether or not the user has clicked "Let's eat"
  renderAddressPopup = () => {
    if (this.state.preferencesPopup) {
      return (
        <div>
          <h4>What do you like to eat?</h4>
          <div className="FeedAddressOverlayTagComponent">
            <div className="FeedAddressOverlayAppliedTags">
              {this.getTagList()}
              <div
                style={{
                  color: "red",
                  display: "inline",
                  marginLeft: 10,
                }}
              ></div>
            </div>
            <div className="FeedAddressOverlayTagArea">{this.getTagBank()}</div>
          </div>
          <Button
            variant="success"
            onClick={() => {
              this.props.updateAddressHandler(
                this.state.address,
                this.state.tags
              );
            }}
          >
            Take me to the food!
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <h4>Please enter your address</h4>
          {/*
            After pressing "Let's eat", the address variable will be passed as
            an argument to the updateAddressHandler method found in the parent
            component, Feed.js
          */}
          <form onSubmit={() => this.setState({ preferencesPopup: true })}>
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
      );
    }
  };

  render() {
    return (
      <div className="FeedAddressOverlayBackground">
        <div className="FeedAddressOverlayPopup">
          {this.renderAddressPopup()}
        </div>
      </div>
    );
  }
}
