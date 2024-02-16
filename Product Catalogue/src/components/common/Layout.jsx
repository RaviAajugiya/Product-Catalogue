import React from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import { URL } from "../config/URLHelper";
import Footer from "./footer/Footer";

function Layout() {
  const location = useLocation();
  const isAuth = location.pathname != URL.AUTH;

  return (
    <>
      {isAuth ? <Header /> : null}
      <main className="min-h-[calc(100vh-316px-34px)] max-h-full">
        <Outlet />
      </main>
      {isAuth ? <Footer /> : null}
    </>
  );
}

export default Layout;
