import React, { useState } from "react";
import { Box, Container, Divider, Typography, Button } from "@mui/material";
import Tags from "./Tags";
import Products from "./Procucts";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode function
import { useEffect } from "react";
import { URL } from "../config/URLHelper";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const localData = localStorage.getItem("userData");
  console.log(localData);

  useEffect(() => {
    if (localData) {
      const token = JSON.parse(localData).token;
      const decodedToken = jwtDecode(token);

      setIsAdmin(
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] === "Admin"
      );
    }
  }, [localData]);

  return isAdmin ? (
    <Container className="flex mt-5 gap-10 flex-wrap justify-between">
      <Products />
      <Divider orientation="vertical" flexItem className="hidden md:block" />
      <Tags />
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
