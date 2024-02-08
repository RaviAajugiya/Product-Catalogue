import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import { createRoutesFromElements } from "react-router-dom";
import { Route } from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import Layout from "./components/common/Layout.jsx";
import { RouterProvider } from "react-router-dom";
import { URL } from "./components/config/URLHelper.js";
import Login from "./components/login/Login.jsx";
import { ThemeProvider } from "@mui/material";
import theme from "./components/common/theme.js";
import "./index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={URL.HOME} element={<Layout />}>
      <Route path={URL.HOME} element={<Home />} />
      <Route path={URL.AUTH} element={<Login />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <Provider store={store}>
  <ThemeProvider theme={theme}>
    <RouterProvider router={router} />
  </ThemeProvider>
  // </Provider>
);
