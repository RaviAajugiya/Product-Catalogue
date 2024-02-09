import { createTheme } from "@mui/material/styles";
const rootElement = document.getElementById("root");

const theme = createTheme({
  components: {
    MuiPopover: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiDialog: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiModal: {
      defaultProps: {
        container: rootElement,
      },
    },
  },

  palette: {
    primary: {
      main: "#131118", // primary color
      white: "#ffffff",
      border: "#eeeeee",
    },
    secondary: {
      main: "#a4a1aa", // secondary color for text
    },
  },
  typography: {
    fontFamily: [
      "Popins", // Specify Popin as the default font family
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

export default theme;
