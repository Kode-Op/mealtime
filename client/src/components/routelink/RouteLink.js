import React from "react";
import { useRouteMatch, Link } from "react-router-dom";

//This method renders non-clickable plain text in the sidebar if the
//current URL matches the route for that particular link. Otherwise,
//it will render a link to that URL.
const RouteLink = ({ to, label }) => {
  let routematch = useRouteMatch({
    path: to
  });

  if (routematch) {
    return <div style={{ cursor: "default" }}>{label}</div>;
  } else {
    return <Link to={to}>{label}</Link>;
  }
};

export default RouteLink;
