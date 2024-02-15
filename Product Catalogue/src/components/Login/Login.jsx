import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import appLogo from "./../../assets/Krist.svg";
import LoginImg from "./../../assets/login.png";
import DynamicForm from "../common/form/DynamicForm";
import { Formik } from "formik";
import * as Yup from "yup";
import { loginForm, registerForm } from "../config/constant";
import { useLocation, useSearchParams } from "react-router-dom"; // Import useSearchParams
import { useLoginMutation, useRegisterMutation } from "../../redux/api/authApi";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/slice/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page") || "login";

  const [isLoginPage, setIsLoginPage] = useState(page === "login");

  const [searchParams, setSearchParams] = useSearchParams();

  const [authLogin, { data: loginData }] = useLoginMutation();
  const [authRegister, { data: registerData }] = useRegisterMutation();

  useEffect(() => {
    if (loginData) {
      localStorage.setItem("userData", JSON.stringify(loginData));
      dispatch(login(loginData));
      navigate("/");
    }
    if (registerData) {
      setIsLoginPage(true);
    }
  }, [loginData, registerData]);

  useEffect(() => {
    if (isLoginPage) {
      setSearchParams({ page: "login" });
    } else {
      setSearchParams({ page: "signup" });
    }
  }, [isLoginPage, setSearchParams]);

  const handleSubmit = (values) => {
    console.log(values);
    isLoginPage ? authLogin(values) : authRegister(values);
  };

  const validationSchema = isLoginPage
    ? loginForm.loginValidationSchema
    : registerForm.registerValidationSchema;

  const initialValues = isLoginPage
    ? loginForm.loginInitialValues
    : registerForm.RegisterInitialValues;

  const fields = isLoginPage
    ? loginForm.loginFields
    : registerForm.registerFields;

  return (
    <div maxWidth={false} sx={{ width: "100vw" }} disableGutters>
      <Box
        display="flex"
        alignItems="center"
        className="h-screen overflow-hidden">
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
          className="lg:w-2/5 max-w-[600px] m-auto">
          <Box>
            <img src={appLogo} alt="Logo" />
          </Box>
          <Box className="text-left mt-6">
            <Typography variant="h5">Welcome</Typography>
            <Typography gutterBottom color="secondary">
              {isLoginPage ? "Please login here" : "Create an account"}
            </Typography>
          </Box>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validateOnChange={false}
            validationSchema={validationSchema}>
            {(formikProps) => (
              <form onSubmit={formikProps.handleSubmit}>
                <DynamicForm
                  fields={fields}
                  values={formikProps.values}
                  onChange={formikProps.handleChange}
                  errors={formikProps.errors}
                  touched={formikProps.touched}
                />

                <Box display="flex" justifyContent="space-between">
                  <Typography
                    className="cursor-pointer"
                    color="secondary"
                    onClick={() => setIsLoginPage((prev) => !prev)}>
                    {isLoginPage
                      ? "Create new account"
                      : "Already have an account?"}
                  </Typography>
                  <Typography color="secondary">Forgot password?</Typography>
                </Box>
                <Button
                  type="submit"
                  className="mt-5"
                  variant="contained"
                  color="primary"
                  fullWidth>
                  {isLoginPage ? "Login" : "Register"}
                </Button>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </div>
  );
}

export default Login;
