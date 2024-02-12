import { Avatar, Button, Container } from "@mui/material";
import React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import appLogo from "./../../assets/Krist.svg";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { URL } from "../config/URLHelper";
import { useState } from "react";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function Header() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const localData = localStorage.getItem("userData");
    if (localData) {
      const token = JSON.parse(localData).token;
      console.log(token);
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);

      // Extract username from the decoded token
      const username =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ];
      setUserName(username); // Set the username in the state
    }
  }, []);

  console.log(userName);

  return (
    <AppBar position="static">
      <Box sx={{ flexGrow: 1, bgcolor: "primary.main" }}>
        <Container maxWidth="lg" disableGutters>
          <Toolbar className="flex justify-between">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer">
              <Link to={URL.HOME}>
                <img src={appLogo} alt="" className="invert w-20" />
              </Link>
            </IconButton>
            <Search className="mx-6">
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <Avatar sx={{ bgcolor: "white", color: "primary.main" }}>R</Avatar>
          </Toolbar>
        </Container>
      </Box>
    </AppBar>
  );
}

export default Header;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
