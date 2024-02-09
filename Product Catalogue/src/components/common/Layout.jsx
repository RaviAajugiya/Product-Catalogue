import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import { URL } from "../config/URLHelper";

function Layout() {
  const location = useLocation();
  const isAuth = location.pathname != URL.AUTH;

  return (
    <>
      {isAuth ? <Header /> : null}
      <Outlet />
      {isAuth ? <Footer /> : null}
    </>
  );
}

export default Layout;
