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
    },
    props: {
        MuiPaper: {
            elevation: 3,
        },
        MuiCard: {
            elevation: 3,
        },
    },
});

export default theme;
