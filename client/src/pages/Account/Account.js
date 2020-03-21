import React, { Component } from "react";
import { Link, Route, useRouteMatch } from "react-router-dom";
import Navbar from "../../components/nav/Navbar";
import Profile from "./Profile";
import CreditCard from "./CreditCard";
import Address from "./Address";
import "./Account.css";

function CustomLink({ to, label }) {
  let routematch = useRouteMatch({
    path: to
  });

  if (routematch) {
    return <div style={{ cursor: "default" }}>{label}</div>;
  } else {
    return <Link to={to}>{label}</Link>;
  }
}

export default class Account extends Component {
  render() {
    return (
      <div className="accountcontainer">
        <Navbar />
        <div className="accountleftpane">
          <h2>Your account</h2>
          <ul>
            <li>
              <CustomLink to="/account/profile" label="Profile" />
            </li>
            <li>
              <CustomLink to="/account/card" label="Credit card information" />
            </li>
            <li>
              <CustomLink to="/account/address" label="Address and phone" />
            </li>
          </ul>
        </div>
        <div className="accountrightpane">
          <Route path="/account/profile" component={Profile} />
          <Route path="/account/card" component={CreditCard} />
          <Route path="/account/address" component={Address} />
        </div>
      </div>
    );
  }
}
