import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { adminProtectedRoutes, protectedRoutes, publicRoutes } from "./routes";
import { Suspense } from "react";
import Authmiddleware from "./AuthPages/AuthLayout";
import NonAuthLayout from "./AuthPages/NonAuthLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
            key={idx}
            exact={true}
          />
        ))}

        {adminProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <AdminAuthmiddleware>{route.component}</AdminAuthmiddleware>
            }
            key={idx}
            exact={true}
          />
        ))}

        {protectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<Authmiddleware>{route.component}</Authmiddleware>}
            key={idx}
            exact={true}
          />
        ))}
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        closeButton={
          <button
            style={{
              width: "30px",
              backgroundColor: "inherit",
              border: "none",
              color: "white",
            }}
          >
            X
          </button>
        }
      />
    </>
  );
}

export default App;
