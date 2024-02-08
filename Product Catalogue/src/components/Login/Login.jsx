import React from "react";
import { Box, Container, TextField, Button, Typography } from "@mui/material";
import appLogo from "./../../assets/Krist.svg";
import LoginImg from "./../../assets/login.png";

function Login() {
  return (
    <Container maxWidth={false} disableGutters>
      <Box display="flex" width="100%" alignItems="center">
        {/* Image */}
        <Box style={{ height: "100vh" }}>
          {" "}
          {/* Set height to 100vh */}
          <img
            src={LoginImg}
            alt=""
            style={{ width: "100%", height: "100%" }}
          />
        </Box>

        {/* Login Form */}
        <Box flexGrow={1} textAlign="center" ml={2}>
          <Box>
            <img src={appLogo} alt="Logo" style={{ width: "100px" }} />
          </Box>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
          />
          <Button variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
