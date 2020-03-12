import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Data from "./pages/Data";
import Home from "./pages/Home";
import Login from "./components/login/Login";
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
          <Route path="/data" component={Data} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
