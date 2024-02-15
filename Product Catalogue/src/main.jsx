import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import { createRoutesFromElements } from "react-router-dom";
import { Route } from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import Layout from "./components/common/Layout.jsx";
import { RouterProvider } from "react-router-dom";
import { URL } from "./components/config/URLHelper.js";
import { ThemeProvider } from "@mui/material";
import theme from "./components/common/theme.js";
import "./index.css";
import Login from "./components/Login/Login.jsx";
import { StyledEngineProvider } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import Wishlist from "./components/WishList/Wishlist.jsx";
import Admin from "./components/admin/Admin.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfirmProvider } from "material-ui-confirm";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={URL.HOME} element={<Layout />}>
      <Route path={URL.HOME} element={<Home />} />
      <Route path={URL.AUTH} element={<Login />} />
      <Route path={URL.WISHLIST} element={<Wishlist />} />
      <Route path={URL.ADMIN} element={<Admin />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <ConfirmProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </ConfirmProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </Provider>
);
