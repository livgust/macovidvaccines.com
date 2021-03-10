import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
    //make UI elements slightly darker then default to improve contrast with white text
    palette: {
        primary: {
            main: "#0D5A9B",
        },
        secondary: {
            main: "#AD003B",
        },
        text: {
            secondary: "rgba(0, 0, 0, 0.66)",
        },
    },
    props: {
        MuiPaper: {
            elevation: 3, // default was 1
        },
        MuiCard: {
            elevation: 3, // default was 1
        },
        MuiLink: {
            underline: "always", // default was "hover"
        },
    },
    drawerWidth: 300,
});

export default theme;
