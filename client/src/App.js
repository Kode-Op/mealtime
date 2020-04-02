import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

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
        </Switch>
      </div>
    </Router>
  );
}

export default App;
