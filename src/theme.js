import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    //make UI elements slightly darker then default to improve contrast with white text
    palette: {
        primary: { main: "#0D5A9B"},
            secondary: {

            main: '#AD003B',
        },
    },
});

export default theme