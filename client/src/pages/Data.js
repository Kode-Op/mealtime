import React, { Component } from "react";
import axios from "axios";

//Import Components
import ApiComponent from "../components/api-component";
import MenuItemComponent from "../components/menuitem-component";
import OrderComponent from "../components/order-component";
import RestaurantComponent from "../components/restaurant-component";
import ReviewComponent from "../components/review-component";
import UserComponent from "../components/user-component";

export default class Data extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apikeys: [],
      menuitems: [],
      orders: [],
      restaurants: [],
      reviews: [],
      users: []
    };
  }

  componentDidMount() {
    axios
      .get("/api/apikeys")
      .then(response => {
        this.setState({ apikeys: response.data });
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get("/api/menuitems")
      .then(response => {
        this.setState({ menuitems: response.data });
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get("/api/orders")
      .then(response => {
        this.setState({ orders: response.data });
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get("/api/restaurants")
      .then(response => {
        this.setState({ restaurants: response.data });
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get("/api/reviews")
      .then(response => {
        this.setState({ reviews: response.data });
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get("/api/users")
      .then(response => {
        this.setState({ users: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  apiList() {
    return this.state.apikeys.map(currentAPI => {
      return <ApiComponent apiKey={currentAPI} key={currentAPI._id} />;
    });
  }
  menuItemList() {
    return this.state.menuitems.map(currentMenuItem => {
      return (
        <MenuItemComponent
          menuItem={currentMenuItem}
          key={currentMenuItem._id}
        />
      );
    });
  }
  orderList() {
    return this.state.orders.map(currentOrder => {
      return <OrderComponent order={currentOrder} key={currentOrder._id} />;
    });
  }
  restaurantList() {
    return this.state.restaurants.map(currentRestaurant => {
      return (
        <RestaurantComponent
          restaurant={currentRestaurant}
          key={currentRestaurant._id}
        />
      );
    });
  }
  reviewList() {
    return this.state.reviews.map(currentReview => {
      return <ReviewComponent Review={currentReview} key={currentReview._id} />;
    });
  }
  userList() {
    return this.state.users.map(currentUser => {
      return <UserComponent user={currentUser} key={currentUser._id} />;
    });
  }

  render() {
    return (
      <div>
        <h3>API Keys</h3>
        <table>
          <thead>
            <tr>
              <th>_id</th>
              <th>name</th>
              <th>key</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>__v</th>
            </tr>
          </thead>
          <tbody>{this.apiList()}</tbody>
        </table>

        <h3>Menu Items</h3>
        <table>
          <thead>
            <tr>
              <th>_id</th>
              <th>name</th>
              <th>price</th>
              <th>preptime</th>
              <th>description</th>
              <th>tag</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>__v</th>
            </tr>
          </thead>
          <tbody>{this.menuItemList()}</tbody>
        </table>

        <h3>Orders</h3>
        <table>
          <thead>
            <tr>
              <th>_id</th>
              <th>userID</th>
              <th>restaurantID</th>
              <th>x_coordinate</th>
              <th>y_coordinate</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>__v</th>
            </tr>
          </thead>
          <tbody>{this.orderList()}</tbody>
        </table>

        <h3>Restaurants</h3>
        <table>
          <thead>
            <tr>
              <th>_id</th>
              <th>tag</th>
              <th>menuitem</th>
              <th>hoursofoperation</th>
              <th>name</th>
              <th>price</th>
              <th>rating</th>
              <th>description</th>
              <th>minorder</th>
              <th>x_coordinate</th>
              <th>y_coordinate</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>__v</th>
            </tr>
          </thead>
          <tbody>{this.restaurantList()}</tbody>
        </table>

        <h3>Reviews</h3>
        <table>
          <thead>
            <tr>
              <th>_id</th>
              <th>review</th>
              <th>restaurantid</th>
              <th>userid</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>__v</th>
            </tr>
          </thead>
          <tbody>{this.reviewList()}</tbody>
        </table>

        <h3>Users</h3>
        <table>
          <thead>
            <tr>
              <th>_id</th>
              <th>preferencesTag</th>
              <th>orderHistory</th>
              <th>userID</th>
              <th>email</th>
              <th>userName</th>
              <th>firstName</th>
              <th>lastName</th>
              <th>password</th>
              <th>creditCardName</th>
              <th>creditCardNumber</th>
              <th>creditCardCCV</th>
              <th>expMonth</th>
              <th>expYear</th>
              <th>x_coordinate</th>
              <th>y_coordinate</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>__v</th>
            </tr>
          </thead>
          <tbody>{this.userList()}</tbody>
        </table>

        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}
