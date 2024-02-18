import React, { useState } from "react";
import { Box, Container, Divider, Typography, Button } from "@mui/material";
import Tags from "./Tags";
import Products from "./Procucts";
import { jwtDecode } from "jwt-decode";
import { URL } from "../config/URLHelper";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Admin() {
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.userData?.token);
  let isAdmin;
  if (token) {
    const decodedToken = jwtDecode(token);
    isAdmin =
      decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] === "Admin";
  }

  return isAdmin ? (
    <Container className="flex my-5 gap-10 flex-wrap justify-between">
      <Products />
      <Divider orientation="vertical" flexItem className="hidden lg:block" />
      <Tags />
      <Divider orientation="vertical" flexItem className="hidden lg:block" />
      
    </Container>
  ) : (
    <Box className="flex flex-col gap-2 justify-center items-center text-center m-auto h-full mt-10">
      <Typography variant="h5" align="center" gutterBottom>
        You do not have permission to access this page.
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Please contact the administrator for assistance.
      </Typography>
      <Button
        className="w-fit"
        variant="contained"
        color="primary"
        sx={{ textTransform: "none" }}
        onClick={() => navigate(URL.HOME)}>
        Go to Home
      </Button>
    </Box>
  );
}

export default Admin;
