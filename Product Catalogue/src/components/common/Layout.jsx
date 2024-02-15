import React from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import { URL } from "../config/URLHelper";
import Footer from "../footer/Footer";

function Layout() {
  const location = useLocation();
  const isAuth = location.pathname != URL.AUTH;

  return (
    <>
      {isAuth ? <Header /> : null}
      <Outlet />
      {/* {isAuth ? <Footer /> : null} */}
    </>
  );
}

export default Layout;
