import React from "react";
import { Box, Container, TextField, Button, Typography } from "@mui/material";
import appLogo from "./../../assets/Krist.svg";
import LoginImg from "./../../assets/login.png";

function Login() {
  return (
    <div maxWidth={false} sx={{ width: "100vw" }} disableGutters>
      <Box
        display="flex"
        alignItems="center"
        className="h-screen overflow-hidden"
      >
        <Box>
          <img
            src={LoginImg}
            alt=""
            className="w-[50vw] object-cover h-screen hidden lg:block"
          />
        </Box>

        <Box
          flexGrow={1}
          p={3}
          textAlign="center"
          className="lg:w-2/5 max-w-[600px] m-auto"
        >
          <Box>
            <img src={appLogo} alt="Logo" />
          </Box>
          <Box className="text-left mt-6">
            <Typography variant="h5">Welcome</Typography>
            <Typography gutterBottom color="secondary">
              Please login here
            </Typography>
          </Box>
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
          <Box display="flex" justifyContent="space-between">
            <Typography color="secondary">Create new account</Typography>
            <Typography color="secondary">Forgot password?</Typography>
          </Box>
          <Button
            className="mt-5"
            variant="contained"
            color="primary"
            fullWidth
          >
            Login
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default Login;
