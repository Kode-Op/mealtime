import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Data from "./pages/Data";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/data" component={Data} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
