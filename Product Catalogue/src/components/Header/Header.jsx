import { Button, Container } from "@mui/material";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import appLogo from "./../../assets/Krist.svg";
import { Link } from "react-router-dom";
import { URL } from "../config/URLHelper";
import { useState } from "react";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { login, logout } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

function Header() {
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const localData = localStorage.getItem("userData");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  if (localData && !userData) {
    dispatch(login(JSON.parse(localData)));
  }

  useEffect(() => {
    if (localData) {
      const token = JSON.parse(localData).token;
      // console.log(token);
      const decodedToken = jwtDecode(token);
      // console.log(decodedToken);

      const username =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ];

      setIsAdmin(
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] === "Admin"
      );
      setUserName(username);
    }
  }, []);

  return (
    <AppBar position="static" className="bg-white ">
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" disableGutters>
          <Toolbar className="flex justify-between items-center">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer">
              <Link to={URL.HOME}>
                <img src={appLogo} alt="" className="w-20" />
              </Link>
            </IconButton>
            <Box>
              <Button
                sx={{ textTransform: "none" }}
                onClick={() => navigate(URL.HOME)}>
                Home
              </Button>
              <Button
                sx={{ textTransform: "none" }}
                onClick={() => navigate(URL.WISHLIST)}>
                WishList
              </Button>
              {isAdmin ? (
                <>
                  <Button
                    sx={{ textTransform: "none" }}
                    onClick={() => navigate(URL.ADMIN)}>
                    Manage Product
                  </Button>
                </>
              ) : null}
            </Box>
            <Box className="flex gap-3 items-center text-black">
              <Typography>Welocome {userName}</Typography>
              {userData ? (
                <Button
                  sx={{ textTransform: "none" }}
                  variant="contained"
                  onClick={() => {
                    localStorage.removeItem("userData");
                    dispatch(logout());
                    navigate(URL.HOME);
                    window.location.reload();
                  }}>
                  logout
                </Button>
              ) : (
                <Button
                  sx={{ textTransform: "none" }}
                  variant="contained"
                  onClick={() => {
                    navigate(URL.AUTH);
                  }}>
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </Box>
    </AppBar>
  );
}

export default Header;
