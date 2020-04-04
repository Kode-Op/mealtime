//Import libraries
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//Import components
import Home from "./components/home/Home";
import Account from "./components/account/Account";
import Restaurant from "./components/restaurant/Restaurant";
import RestaurantList from "./components/search/RestaurantList";
import Feed from "./components/feed/Feed";
import Login from "./components/login/Login";
import Logout from "./components/logout/Logout";
import Register from "./components/register/Register";
import RegisterConfirmation from "./components/register/Confirmation";
import LoginConfirmation from "./components/login/Confirmation";
import RestaurantAccount from "./components/account/RestaurantAccount";

//Import stylesheets
import "./App.css";

//This method is responsible for routing the main components of the website,
//and is also the starting point of the app.
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route
            path="/register/confirmation"
            exact
            component={RegisterConfirmation}
          />
          <Route
            path="/login/confirmation"
            exact
            component={LoginConfirmation}
          />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/register" component={Register} />
          <Route path="/account" component={Account} />
          <Route path="/search" component={RestaurantList} />
          <Route path="/feed" component={Feed} />
          <Route path="/restaurant" component={Restaurant} />
          <Route path="/manage" component={RestaurantAccount} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
