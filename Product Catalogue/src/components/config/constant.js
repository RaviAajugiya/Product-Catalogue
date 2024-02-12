import * as Yup from "yup";

export const loginForm = {
  loginFields: [
    {
      type: "text",
      label: "Username",
      name: "username",
    },
    {
      type: "password",
      label: "Password",
      name: "password",
    },
  ],

  loginInitialValues: {
    username: "",
    password: "",
  },

  loginValidationSchema: Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  }),
};

export const registerForm = {
  registerFields: [
    {
      type: "text",
      label: "Username",
      name: "username",
    },
    {
      type: "password",
      label: "Password",
      name: "password",
    },
    {
      type: "password",
      label: "Confirm Password",
      name: "confirmPassword",
    },
    {
      type: "text",
      label: "Email",
      name: "email",
    },
  ],

  registerValidationSchema: Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  }),

  RegisterInitialValues: {
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  },
};
