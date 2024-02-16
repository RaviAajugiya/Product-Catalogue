import {
  Avatar,
  Button,
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useScrollTrigger,
} from "@mui/material";
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
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useConfirm } from "material-ui-confirm";

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Header() {
  const confirm = useConfirm();
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const localData = localStorage.getItem("userData");
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  if (localData && !userData) {
    dispatch(login(JSON.parse(localData)));
  }

  useEffect(() => {
    if (localData) {
      const token = JSON.parse(localData).token;
      const decodedToken = jwtDecode(token);

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
                <img src={appLogo} alt="" className="w-20 mt-2" />
              </Link>
            </IconButton>
            <Box className="hidden md:block">
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
            <Box className="hidden md:flex gap-3 items-center text-black">
              <Typography>
                {userData ? `Welcome ${userName}!` : null}
              </Typography>
              {userData ? (
                <Button
                  startIcon={<LogoutIcon />}
                  sx={{ textTransform: "none" }}
                  variant="contained"
                  onClick={() => {
                    confirm({
                      description: "You will be logout from application",
                    }).then(() => {
                      localStorage.removeItem("userData");
                      dispatch(logout());
                      window.location.reload();
                      navigate(URL.HOME);
                    });
                  }}>
                  logout
                </Button>
              ) : (
                <Button
                  startIcon={<LoginIcon />}
                  sx={{ textTransform: "none" }}
                  variant="contained"
                  onClick={() => {
                    navigate(URL.AUTH);
                  }}>
                  Login
                </Button>
              )}
            </Box>
            <Avatar className="md:hidden" onClick={toggleDrawer}>
              A
            </Avatar>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
              <Box sx={{ width: 250 }} onClick={toggleDrawer}>
                <List>
                  <ListItem onClick={() => navigate(URL.HOME)}>
                    <ListItemText primary="Home" />
                  </ListItem>
                  <Divider />
                  <ListItem onClick={() => navigate(URL.WISHLIST)}>
                    <ListItemText primary="Wishlist" />
                  </ListItem>
                  <Divider />
                  {isAdmin ? (
                    <ListItem onClick={() => navigate(URL.ADMIN)}>
                      <ListItemText primary="Manage product" />
                    </ListItem>
                  ) : null}
                  <Divider />
                  {userData ? (
                    <ListItem
                      onClick={() => {
                        localStorage.removeItem("userData");
                        dispatch(logout());
                        navigate(URL.HOME);
                        window.location.reload();
                      }}>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </ListItem>
                  ) : (
                    <ListItem
                      onClick={() => {
                        navigate(URL.AUTH);
                      }}>
                      <ListItemIcon>
                        <LoginIcon />
                      </ListItemIcon>
                      <ListItemText primary="Login" />
                    </ListItem>
                  )}
                </List>
              </Box>
            </Drawer>
          </Toolbar>
        </Container>
      </Box>
    </AppBar>
  );
}

export default Header;
