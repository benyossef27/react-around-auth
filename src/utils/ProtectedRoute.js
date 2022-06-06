import React from "react";
import { Navigate, Route } from "react-router-dom";

export default function ProtectedRoute({ component: Component, ...props }) {
  return (
    <Route>
      {() =>
        props.loggedIn ? <Component {...props} /> : <Navigate to="/signin" />
      }
    </Route>
  );
}
