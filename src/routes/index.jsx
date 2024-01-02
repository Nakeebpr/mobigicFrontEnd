import React from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/register", component: <Register /> },
];

const protectedRoutes = [{ path: "/", component: <Home /> }];

const adminProtectedRoutes = [];

export { protectedRoutes, publicRoutes, adminProtectedRoutes };
