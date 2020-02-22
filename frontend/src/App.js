import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Data from "./components/Data";

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/data" component={Data} />
      </div>
    </Router>
  );
}

export default App;
