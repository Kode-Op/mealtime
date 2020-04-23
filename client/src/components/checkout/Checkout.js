//Import libraries
import React, { Component } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { Redirect } from "react-router-dom";

//Import components
import Navbar from "../nav/Navbar";
import Footer from "../footer/Footer";
import CheckoutOverlay from "./CheckoutOverlay";

//Import assets
import Loader from "../../assets/loader/Loader";

//Import utilities
import GetLogin from "../../utils/GetLogin";
import { getFromStorage, setInStorage } from "../../utils/storage";
import { AddOrder } from "../../utils/axios/Orders";
import {
  GetCreditCardByID,
  AddCreditCard,
} from "../../utils/axios/CreditCards";

//Import stylesheets
import "./Checkout.css";

export default class Checkout extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      user: [],
      isUserLoaded: false,
      restaurant: [],
      restaurantLoaded: false,
      menuItems: [],
      menuItemIDArray: [],
      quantityArray: [],
      creditcards: [],
      creditCardsLoaded: false,
      menuItemsLoaded: false,
      tipPercentage: 18,
      displayCustomTipForm: false,
      tipAmountString: "$",
      tipAmount: 0,
      tipByAmount: false,
      selectedCardID: "",
      deliveryAddress: "",
      deliveryPhoneNumber: "",
      deliveryInstructions: "",
      paymentFirstName: "",
      paymentLastName: "",
      paymentCreditCardNumber: "",
      paymentExpMonth: "",
      paymentExpYear: "",
      paymentCCV: "",
      paymentBillingAddress: "",
      saveCard: false,
      customTipErrorMessage: "",
      submitErrorMessage: "",
      submitSuccessMessage: "",
      totalPaid: 0,
      redirect: "",
    };
  }

  componentDidMount() {
    this._isMounted = true;

    //Get "user" and "isUserLoaded" from the GetLogin utility
    GetLogin()
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            isUserLoaded: true,
            user: response,
          });

          //When the user is loaded, get that user's credit card info
          this.getCreditCardInfo(response._id);
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            isUserLoaded: true,
          });
        }
      });

    //Initialize the value of menuItems to whatever is in storage
    let menuItemArray = getFromStorage("shoppingbag");
    if (menuItemArray !== null) {
      let menuItemIDArray = this.getMenuItemIDArray(menuItemArray.menuItems);
      let quantityArray = this.getQuantityArray(menuItemArray.menuItems);

      //Calculate subTotal, tax, fee, and totalPaid before saving it in our state
      const subTotal = this.getSubTotal(menuItemArray.menuItems);
      const tax = this.getTax(subTotal);
      const fee = 300;
      const totalPaid = Math.round(subTotal + tax + fee);
      this.setState({
        menuItems: menuItemArray.menuItems,
        menuItemsLoaded: true,
        menuItemIDArray: menuItemIDArray,
        quantityArray: quantityArray,
        subTotal: subTotal,
        tax: tax,
        fee: fee,
        totalPaid: totalPaid,
      });
    } else {
      this.setState({
        menuItemsLoaded: true,
      });
    }

    //Get the restaurant from storage. This is used to display
    //"Your order from (restaurantName)"
    let restaurantArray = getFromStorage("restaurant");
    if (restaurantArray !== null) {
      this.setState({
        restaurant: restaurantArray,
        restaurantLoaded: true,
      });
    } else {
      this.setState({
        restaurantLoaded: true,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //Event handlers for each form field
  onChangeDeliveryAddress = (e) => {
    e.preventDefault();
    this.setState({
      deliveryAddress: e.target.value,
    });
  };
  onChangePhoneNumber = (e) => {
    e.preventDefault();
    this.setState({
      deliveryPhoneNumber: e.target.value,
    });
  };
  onChangeDeliveryInstructions = (e) => {
    e.preventDefault();
    this.setState({
      deliveryInstructions: e.target.value,
    });
  };
  onChangePaymentFirstName = (e) => {
    e.preventDefault();
    this.setState({
      paymentFirstName: e.target.value,
    });
  };
  onChangePaymentLastName = (e) => {
    e.preventDefault();
    this.setState({
      paymentLastName: e.target.value,
    });
  };
  onChangePaymentCreditCardNumber = (e) => {
    e.preventDefault();
    this.setState({
      paymentCreditCardNumber: e.target.value,
    });
  };
  onChangePaymentExpMonth = (e) => {
    e.preventDefault();
    this.setState({
      paymentExpMonth: e.target.value,
    });
  };
  onChangePaymentExpYear = (e) => {
    e.preventDefault();
    this.setState({
      paymentExpYear: e.target.value,
    });
  };
  onChangePaymentCCV = (e) => {
    e.preventDefault();
    this.setState({
      paymentCCV: e.target.value,
    });
  };
  onChangePaymentBillingAddress = (e) => {
    e.preventDefault();
    this.setState({
      paymentBillingAddress: e.target.value,
    });
  };
  onChangeTipAmountString = (e) => {
    e.preventDefault();
    this.setState({
      tipAmountString: e.target.value,
    });
  };

  //Updates the credit card info in the state when the user clicks on one
  //of their credit cards
  updateCreditCardInfo = (card) => {
    this.setState({
      selectedCardID: card._id,
      paymentFirstName: card.firstName,
      paymentLastName: card.lastName,
      paymentCreditCardNumber: card.number,
      paymentExpMonth: card.exMonth,
      paymentExpYear: card.exYear,
      paymentCCV: card.ccv,
      paymentBillingAddress: card.address,
    });
  };

  //Resets the credit card info in the state when the user goes to add a
  //new card.
  resetCreditCardInfo = () => {
    this.setState({
      selectedCardID: "0",
      paymentFirstName: "",
      paymentLastName: "",
      paymentCreditCardNumber: "",
      paymentExpMonth: "",
      paymentExpYear: "",
      paymentCCV: "",
      paymentBillingAddress: "",
    });
  };

  //Adds up the quantity * price of all menu items. Returns an integer.
  getSubTotal = (menuItems) => {
    let subTotal = 0;
    menuItems.forEach((currentMenuItem) => {
      subTotal += currentMenuItem.quantity * currentMenuItem.menuItem.price;
    });
    return subTotal;
  };

  //Sales tax rate in California is 7.25%
  getTax = (subtotal) => {
    return subtotal * 0.0725;
  };

  //Extracts an array of just the menu item IDs from the menuItem objects.
  //We need this to post orders to the database
  getMenuItemIDArray = (menuItems) => {
    let menuItemIDArray = [];
    menuItems.forEach((currentMenuItem) => {
      menuItemIDArray.push(currentMenuItem.menuItem._id);
    });
    return menuItemIDArray;
  };

  //Extracts an array of just the quantities from the menuItem objects.
  //We need this to post orders to the database.
  getQuantityArray = (menuItems) => {
    let quantityArray = [];
    menuItems.forEach((currentMenuItem) => {
      quantityArray.push(currentMenuItem.quantity);
    });
    return quantityArray;
  };

  //Obtains the credit card info belonging to a particular user
  getCreditCardInfo = (id) => {
    GetCreditCardByID(id)
      .then((response) => {
        this.setState({
          creditCards: response.data,
          creditCardsLoaded: true,
        });
      })
      .catch(() => {
        this.setState({
          creditCardsLoaded: true,
        });
      });
  };

  //Renders the order summary on the right pane of the page
  getOrderSummary = () => {
    let tip;
    if (this.state.tipByAmount) {
      tip = this.state.tipAmount;
    } else {
      tip = Math.round((this.state.subTotal * this.state.tipPercentage) / 100);
    }
    return (
      <div className="CheckoutOrderSummary">
        <div className="CheckoutOrderTop">
          <h5>Your order from</h5>
          {this.state.restaurant.name}
        </div>
        {this.getMenuItems()}
        <div style={{ height: 25 }} /> {/* Spacer */}
        <div className="CheckoutTotals">
          <div className="CheckoutMenuItemLeft">Item subtotal</div>
          <div className="CheckoutMenuItemRight">
            {this.convertToPrice(1, this.state.subTotal)}
          </div>
        </div>
        <div className="CheckoutTotals">
          <div className="CheckoutMenuItemLeft">Delivery Fee</div>
          <div className="CheckoutMenuItemRight">
            {this.convertToPrice(1, this.state.fee)}
          </div>
        </div>
        <div className="CheckoutTotals">
          <div className="CheckoutMenuItemLeft">Sales tax</div>
          <div className="CheckoutMenuItemRight">
            {this.convertToPrice(1, this.state.tax)}
          </div>
        </div>
        <div className="CheckoutTotals">
          <div className="CheckoutMenuItemLeft">
            Driver Tip{" "}
            {!this.state.displayCustomTipForm && !this.state.tipByAmount && (
              <div style={{ display: "inline" }}>
                ({this.state.tipPercentage}%)
              </div>
            )}
          </div>
          <div className="CheckoutMenuItemRight">
            {this.state.displayCustomTipForm && !this.state.tipByAmount
              ? "--------"
              : this.convertToPrice(1, tip)}
          </div>
        </div>
        <div className="CheckoutFinalPrice">
          <div className="CheckoutTotals">
            <div className="CheckoutMenuItemLeft">Total</div>
            <div className="CheckoutMenuItemRight">
              {this.state.displayCustomTipForm && !this.state.tipByAmount
                ? this.convertToPrice(1, this.state.totalPaid)
                : this.convertToPrice(1, this.state.totalPaid + tip)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  //This method displays the name, quantity and price of each menuItem. Used
  //In conjunction with getOrderSummary
  getMenuItems = () => {
    return this.state.menuItems.map((currentMenuItem) => {
      return (
        <div
          key={currentMenuItem.menuItem._id + " " + currentMenuItem.time}
          className="CheckoutMenuItem"
        >
          <div className="CheckoutMenuItemLeft">
            {currentMenuItem.quantity} x {currentMenuItem.menuItem.name}
          </div>
          <div className="CheckoutMenuItemRight">
            {this.convertToPrice(
              currentMenuItem.quantity,
              currentMenuItem.menuItem.price
            )}
          </div>
        </div>
      );
    });
  };

  //Converts a price to 250, quantity 3, to a string $7.50
  convertToPrice = (quantity, price) => {
    return ((price * quantity) / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  //This method creates a dropdown box option for each year, starting with
  //the current year, and ending with the current year + numYears
  getYearSelection = (numYears) => {
    let start = new Date().getFullYear();
    let rows = [];
    for (let year = start; year <= start + numYears; year++) {
      rows.push(
        <option value={year} key={year}>
          {year}
        </option>
      );
    }
    return rows;
  };

  //This method renders each credit card in the "Enter payment information"
  //portion of the form
  renderCreditCardOptions = (creditCards) => {
    return creditCards.map((currentCard) => {
      return (
        <div key={currentCard._id}>
          <ListGroup.Item
            onClick={() => this.updateCreditCardInfo(currentCard)}
            variant={
              this.state.selectedCardID === currentCard._id ? "secondary" : ""
            }
            style={{ cursor: "pointer" }}
          >
            {currentCard.firstName} {currentCard.lastName} -{" "}
            {currentCard.number}
          </ListGroup.Item>
        </div>
      );
    });
  };

  //This method validates the custom tip entry portion of the form, and then parses
  //the data to return an integer if it is a valid entry
  submitCustomTip = (tipAmountString) => {
    //Regular expression courtesy of https://stackoverflow.com/questions/8829765/regular-expression-for-dollar-amount-in-javascript
    const priceVerification = /^\$?[0-9]+(\.[0-9][0-9])?$/;

    if (!priceVerification.test(tipAmountString)) {
      this.setState({
        customTipErrorMessage: "The tip amount must be in the format $xx.xx",
      });
      return;
    }

    let stringArr = tipAmountString.split(".");
    let dollars = stringArr[0].match(/\d/g);
    dollars = dollars.join("");
    let cents;
    if (stringArr[1]) {
      cents = stringArr[1].match(/\d/g);
      cents = cents.join("");
    } else {
      cents = 0;
    }

    let parsedTip = parseInt(dollars, 10) * 100 + parseInt(cents, 10);
    this.setState({
      tipAmount: parsedTip,
      customTipErrorMessage: "",
      displayCustomTipForm: false,
      tipByAmount: true,
    });
  };

  //This method validate all delivery and payment information form inputs from the user
  validateForm = () => {
    let errorMessage = "";

    //Validate the phone number to make sure it's 10 digits and only contains numbers
    let phoneNumber;

    //If the phone number is untouched (which means deliveryPhoneNumber is not set), then
    //get the phone number from this.state.user.phone
    if (this.state.deliveryPhoneNumber !== "") {
      phoneNumber = this.state.deliveryPhoneNumber;
    } else {
      phoneNumber = this.state.user.phone;
    }

    if (phoneNumber.length !== 10) {
      errorMessage = errorMessage.concat(
        "Your phone number must have 10 characters.\n"
      );
    }

    if (isNaN(phoneNumber)) {
      errorMessage = errorMessage.concat(
        "Your phone number must only contain numbers.\n"
      );
    }

    //If the custom tip form is being displayed, the user hasn't submitted their entry
    if (this.state.displayCustomTipForm) {
      errorMessage = errorMessage.concat("You must enter a tip amount.\n");
    }

    //This is already pre-validated from the button so the selectedCardID should never be
    //blank. Just in case it is, we validate it here anyway
    if (this.state.selectedCardID === "") {
      errorMessage = errorMessage.concat("You must select a form of payment\n");

      //Else, if user adds a new card (we don't validate existing cards)
    } else if (this.state.selectedCardID === "0") {
      if (this.state.paymentCreditCardNumber.length !== 16) {
        errorMessage = errorMessage.concat(
          "Your credit card must have 16 characters.\n"
        );
      }

      if (isNaN(this.state.paymentCreditCardNumber)) {
        errorMessage = errorMessage.concat(
          "Your credit card must only contain numbers.\n"
        );
      }

      if (isNaN(this.state.paymentCCV)) {
        errorMessage = errorMessage.concat(
          "Your CCV must only contain numbers.\n"
        );
      }

      if (this.state.paymentCCV.length !== 3) {
        errorMessage = errorMessage.concat(
          "Your CCV must have 3 characters.\n"
        );
      }

      if (
        this.state.paymentExpMonth === "blankmonth" ||
        this.state.paymentExpMonth === ""
      ) {
        errorMessage = errorMessage.concat("You must enter a month.\n");
      }

      if (
        this.state.paymentExpYear === "blankyear" ||
        this.state.paymentExpYear === ""
      ) {
        errorMessage = errorMessage.concat("You must enter a year.\n");
      }
    }

    if (errorMessage) {
      this.setState({
        submitErrorMessage: errorMessage,
        submitSuccessMessage: "",
      });
      return false;
    }
    this.setState({
      submitErrorMessage: "",
    });
    return true;
  };

  //This method is called when the user presses the submit button to compete their order
  //There are two cases when submitting this form:

  //Case 1: The user chooses to pay with a new card. This requires us to first post that credit
  //card to our database before posting the order

  //Case 2: The user chooses to pay with an existing card, which means we can skip posting
  //it to the database
  submitCheckout = (e) => {
    e.preventDefault();
    if (this.validateForm()) {
      let address;

      //If the delivery address is untouched (which means deliveryAddress is not set),
      //then get the address from this.state.user.address;
      if (this.state.deliveryAddress !== "") {
        address = this.state.deliveryAddress;
      } else {
        address = this.state.user.address;
      }

      //Case 1
      if (this.state.selectedCardID === "0") {
        let pkg = {
          userId: this.state.user._id,
          firstName: this.state.paymentFirstName,
          lastName: this.state.paymentLastName,
          number: this.state.paymentCreditCardNumber,
          exMonth: this.state.paymentExpMonth,
          exYear: this.state.paymentExpYear,
          ccv: this.state.paymentCCV,
          address: this.state.paymentBillingAddress,
          isDeleted: !this.state.saveCard,
        };

        //Post the card to the database
        AddCreditCard(pkg)
          .then((response) => {
            const pkg2 = {
              userId: this.state.user._id,
              restaurantId: this.state.restaurant._id,
              creditCardId: response.data.id,
              menuItems: this.state.menuItemIDArray,
              quantity: this.state.quantityArray,
              address: address,
              instructions: this.state.deliveryInstructions,
              totalPaid: this.state.totalPaid,
            };

            //Post the order to the database
            AddOrder(pkg2)
              .then((response) => {
                this.setState({
                  submitErrorMessage: "",
                  submitSuccessMessage: "Successfully added order",
                });

                //Reset menu items in storage
                setInStorage("restaurant", null).then(() => {
                  setInStorage("shoppingbag", null).then(() => {
                    this.setState({
                      redirect: response.data.id,
                    });
                  });
                });

                return true;
              })
              .catch((error) => {
                console.log(error);
                this.setState({
                  submitErrorMessage: "An unexpected error has occurred",
                  submitSuccessMessage: "",
                });
              });
          })
          .catch((error) => {
            console.log(error);
            this.setState({
              submitErrorMessage: "An unexpected error has occurred",
              submitSuccessMessage: "",
            });
          });

        //Case 2
      } else {
        const pkg = {
          userId: this.state.user._id,
          restaurantId: this.state.restaurant._id,
          creditCardId: this.state.selectedCardID,
          menuItems: this.state.menuItemIDArray,
          quantity: this.state.quantityArray,
          address: address,
          instructions: this.state.deliveryInstructions,
          totalPaid: this.state.totalPaid,
        };

        //Post the order to the database
        AddOrder(pkg)
          .then((response) => {
            this.setState({
              submitErrorMessage: "",
              submitSuccessMessage: "Successfully added order",
            });

            //Reset menu items in storage
            setInStorage("restaurant", null).then(() => {
              setInStorage("shoppingbag", null).then(() => {
                this.setState({
                  redirect: response.data.id,
                });
              });
            });

            return true;
          })
          .catch((error) => {
            console.log(error);
            this.setState({
              submitErrorMessage: "An unexpected error has occurred",
              submitSuccessMessage: "",
            });
          });
      }
    }
  };

  render() {
    const {
      isUserLoaded,
      user,
      restaurantLoaded,
      menuItemsLoaded,
      creditCardsLoaded,
      menuItems,
      restaurant,
      creditCards,
      selectedCardID,
      paymentFirstName,
      paymentLastName,
      paymentCreditCardNumber,
      paymentExpMonth,
      paymentExpYear,
      paymentCCV,
      paymentBillingAddress,
      deliveryInstructions,
      deliveryAddress,
      deliveryPhoneNumber,
      tipPercentage,
      tipAmountString,
      displayCustomTipForm,
      saveCard,
      customTipErrorMessage,
      submitErrorMessage,
      submitSuccessMessage,
      tipByAmount,
      redirect,
    } = this.state;

    if (redirect !== "") {
      return <Redirect to={"/order?id=" + redirect} />;
    }

    if (restaurantLoaded && menuItemsLoaded && isUserLoaded) {
      return (
        <div>
          {user.length === 0 && <CheckoutOverlay />}
          <Navbar
            user={user}
            menuItems={menuItems}
            restaurant={restaurant}
            disableToggle={true}
          />
          <div className="CheckoutContainer">
            <div className="CheckoutBarMain">
              <h4>Enter delivery information</h4>
              <hr />
              <form onSubmit={(e) => this.submitCheckout(e)}>
                <label htmlFor="address" className="CheckoutFormText">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  defaultValue={user.address}
                  onChange={this.onChangeDeliveryAddress}
                  className="CheckoutInputBox"
                  required
                />
                <label htmlFor="phone" className="CheckoutFormText">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={user.phone}
                  onChange={this.onChangePhoneNumber}
                  className="CheckoutInputBox"
                  maxLength="10"
                  required
                />
                <label
                  htmlFor="deliveryinstructions"
                  className="CheckoutFormText"
                >
                  Add delivery instructions
                </label>
                <textarea
                  className="CheckoutTextArea"
                  name="deliveryinstructions"
                  value={deliveryInstructions}
                  onChange={this.onChangeDeliveryInstructions}
                />
                <h4>Enter payment information</h4>
                <hr />
                <ListGroup variant="flush">
                  {creditCardsLoaded &&
                    this.renderCreditCardOptions(creditCards)}
                  <ListGroup.Item
                    onClick={() => this.resetCreditCardInfo()}
                    variant={selectedCardID === "0" ? "secondary" : ""}
                    style={{ cursor: "pointer" }}
                  >
                    New card+
                  </ListGroup.Item>
                </ListGroup>
                <div style={{ height: 30 }} /> {/* Spacer */}
                {selectedCardID === "0" && (
                  <div>
                    <div className="CheckoutCreditCardContainer">
                      <div>
                        <label htmlFor="fname" className="ProfileFormTest">
                          First name
                        </label>
                        <input
                          type="text"
                          name="fname"
                          value={paymentFirstName}
                          onChange={this.onChangePaymentFirstName}
                          className="CheckoutInputBoxSmall"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lname" className="ProfileFormTest">
                          Last name
                        </label>
                        <input
                          type="text"
                          name="lname"
                          value={paymentLastName}
                          onChange={this.onChangePaymentLastName}
                          className="CheckoutInputBoxSmall"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="number" className="ProfileFormTest">
                          Credit card number
                        </label>
                        <input
                          type="text"
                          name="number"
                          value={paymentCreditCardNumber}
                          onChange={this.onChangePaymentCreditCardNumber}
                          maxLength="16"
                          className="CheckoutInputBoxSmall"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="month" className="ProfileFormTest">
                          Exp. Month
                        </label>

                        <select
                          id="month"
                          className="CheckoutInputBoxSmall"
                          value={paymentExpMonth}
                          onChange={this.onChangePaymentExpMonth}
                        >
                          <option value="blankmonth"></option>
                          <option value="1">01 - January</option>
                          <option value="2">02 - February</option>
                          <option value="3">03 - March</option>
                          <option value="4">04 - April</option>
                          <option value="5">05 - May</option>
                          <option value="6">06 - June</option>
                          <option value="7">07 - July</option>
                          <option value="8">08 - August</option>
                          <option value="9">09 - September</option>
                          <option value="10">10 - October</option>
                          <option value="11">11 - November</option>
                          <option value="12">12 - December</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="year" className="ProfileFormTest">
                          Exp. Year
                        </label>
                        <select
                          id="year"
                          className="CheckoutInputBoxSmall"
                          value={paymentExpYear}
                          onChange={this.onChangePaymentExpYear}
                        >
                          <option value="blankyear"></option>
                          {this.getYearSelection(10)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="ccv" className="ProfileFormTest">
                          CCV
                        </label>
                        <input
                          type="text"
                          maxLength="3"
                          name="ccv"
                          value={paymentCCV}
                          onChange={this.onChangePaymentCCV}
                          className="CheckoutInputBoxSmall"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="address" className="ProfileFormTest">
                          Billing address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={paymentBillingAddress}
                          onChange={this.onChangePaymentBillingAddress}
                          className="CheckoutInputBoxSmall"
                          required
                        />
                      </div>
                    </div>
                    <input
                      type="checkBox"
                      name="saveCard"
                      checked={saveCard}
                      onChange={() =>
                        this.setState({
                          saveCard: !saveCard,
                        })
                      }
                    />{" "}
                    <label htmlFor="saveCard">Save this card?</label>
                  </div>
                )}
                <h4>Add a tip for your driver</h4>
                <hr />
                <div className="CheckoutCreditCardContainer">
                  <Button
                    variant={
                      tipPercentage === 0 &&
                      !displayCustomTipForm &&
                      !tipByAmount
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() =>
                      this.setState({
                        tipPercentage: 0,
                        tipByAmount: false,
                        displayCustomTipForm: false,
                      })
                    }
                    style={{ width: 200, margin: "0 20px 20px 0" }}
                  >
                    No tip
                  </Button>
                  <Button
                    variant={
                      tipPercentage === 15 &&
                      !displayCustomTipForm &&
                      !tipByAmount
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() =>
                      this.setState({
                        tipPercentage: 15,
                        tipByAmount: false,
                        displayCustomTipForm: false,
                      })
                    }
                    style={{ width: 200, margin: "0 20px 20px 0" }}
                  >
                    15%
                  </Button>
                  <Button
                    variant={
                      tipPercentage === 18 &&
                      !displayCustomTipForm &&
                      !tipByAmount
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() =>
                      this.setState({
                        tipPercentage: 18,
                        tipByAmount: false,
                        displayCustomTipForm: false,
                      })
                    }
                    style={{ width: 200, margin: "0 20px 20px 0" }}
                  >
                    18%
                  </Button>
                  <Button
                    variant={
                      tipPercentage === 20 &&
                      !displayCustomTipForm &&
                      !tipByAmount
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() =>
                      this.setState({
                        tipPercentage: 20,
                        tipByAmount: false,
                        displayCustomTipForm: false,
                      })
                    }
                    style={{ width: 200, margin: "0 20px 20px 0" }}
                  >
                    20%
                  </Button>
                  <Button
                    variant={
                      tipPercentage === 25 &&
                      !displayCustomTipForm &&
                      !tipByAmount
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() =>
                      this.setState({
                        tipPercentage: 25,
                        tipByAmount: false,
                        displayCustomTipForm: false,
                      })
                    }
                    style={{ width: 200, margin: "0 20px 20px 0" }}
                  >
                    25%
                  </Button>
                </div>
                <button
                  className="CheckoutCustomTip"
                  onClick={() =>
                    this.setState({
                      displayCustomTipForm: !displayCustomTipForm,
                    })
                  }
                  type="button"
                >
                  Add a custom tip
                </button>
                {displayCustomTipForm && (
                  <div>
                    <label
                      htmlFor="customTip"
                      className="ProfileFormTest"
                      style={{ paddingTop: 15 }}
                    >
                      Please enter custom tip amount
                    </label>
                    <input
                      type="text"
                      name="customTip"
                      className="CheckoutInputBoxSmall"
                      value={tipAmountString}
                      onChange={this.onChangeTipAmountString}
                      style={{ marginBottom: -10 }}
                    />
                    <Button
                      onClick={() => this.submitCustomTip(tipAmountString)}
                      style={{ marginRight: 20 }}
                    >
                      Submit custom tip
                    </Button>
                    <div className="CheckoutErrorMessage">
                      {customTipErrorMessage}
                    </div>
                  </div>
                )}
                <div style={{ height: 20 }} /> {/* Spacer */}
                <div className="CheckoutErrorMessage">{submitErrorMessage}</div>
                <div className="CheckoutSuccessMessage">
                  {submitSuccessMessage}
                </div>
                <Button
                  type="submit"
                  style={{ marginTop: 15 }}
                  variant={
                    selectedCardID === "" ||
                    (deliveryAddress === "" && user.address === "") ||
                    (deliveryPhoneNumber === "" && user.phone === "") ||
                    paymentFirstName === "" ||
                    paymentLastName === "" ||
                    paymentCreditCardNumber === "" ||
                    paymentExpMonth === "" ||
                    paymentExpMonth === "blankmonth" ||
                    paymentExpYear === "" ||
                    paymentExpYear === "blankyear" ||
                    paymentCCV === "" ||
                    paymentBillingAddress === "" ||
                    displayCustomTipForm
                      ? "secondary"
                      : "success"
                  }
                  disabled={
                    selectedCardID === "" ||
                    (deliveryAddress === "" && user.address === "") ||
                    (deliveryPhoneNumber === "" && user.phone === "") ||
                    paymentFirstName === "" ||
                    paymentLastName === "" ||
                    paymentCreditCardNumber === "" ||
                    paymentExpMonth === "" ||
                    paymentExpMonth === "blankmonth" ||
                    paymentExpYear === "" ||
                    paymentExpYear === "blankyear" ||
                    paymentCCV === "" ||
                    paymentBillingAddress === "" ||
                    displayCustomTipForm
                  }
                  block
                >
                  Bring on the food!
                </Button>
              </form>
            </div>
            <div className="CheckoutBarRight">{this.getOrderSummary()}</div>
          </div>
          <Footer />
        </div>
      );
    } else {
      //Credit card, menu item, restaurant data, or user not loaded
      return <Loader />;
    }
  }
}
