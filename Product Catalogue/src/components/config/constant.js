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
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).*$/,
        "Password must include at least one digit, one lowercase letter, one uppercase letter, and one special character"
      ),
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
