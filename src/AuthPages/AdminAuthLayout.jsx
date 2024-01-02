


import React from "react";
import { Navigate } from "react-router-dom";

const AdminAuthmiddleware = (props) => {
  if (!localStorage.getItem("token")) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }
  return (<React.Fragment>
    {props.children}
  </React.Fragment>);
};

export default AdminAuthmiddleware;
