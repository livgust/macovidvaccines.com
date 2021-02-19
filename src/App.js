import CovidAppointmentTable from "./CovidAppointmentTable";
import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// import { Alert, AlertTitle } from "@material-ui/lab"
import Menu from "./components/Menu";
import { makeStyles, MuiThemeProvider } from "@material-ui/core";
import theme from "./theme";
import StateEligibility from "./components/StateEligibility";

/* Alert to put under page title when necessary
const alert = (
    <>
        <Alert severity="warning">
            <AlertTitle>8:01am Thursday, February 18</AlertTitle>
            Due to high demand, the MA vaccination websites are experiencing
            technical difficulties. Once the issues are resolved, their
            locations will appear on this website.
        </Alert>
        <br />
    </>
);
*/

const useStyles = makeStyles((theme) => ({
    main: {
        padding: theme.spacing(2),
    },
    heading: {
        "text-align": "center",
    },
}));

function App() {
    const classes = useStyles();
    return (
        <MuiThemeProvider theme={theme}>
            <Menu />
            <main className={classes.main}>
                <Grid container justify="center" spacing={3}>
                    <Grid item xs={1} sm={2}></Grid>
                    <Grid item xs={10} sm={8}>
                        <h1 className={classes.heading}>
                            MA Covid Vaccine Appointments
                        </h1>
                        <StateEligibility />
                        <CovidAppointmentTable />
                        <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                        >
                            This site is not affiliated with or endorsed by the
                            Commonwealth of Massachusetts.
                            <br />
                            This site is for informational purposes only. Not
                            all vaccination locations are tracked and the
                            information may not be complete or accurate.
                            <br />
                            Copyright &#169; {new Date().getFullYear()} Olivia
                            Adams/Ora Innovations LLC. All rights reserved.
                        </Typography>
                    </Grid>
                    <Grid item xs={1} sm={2}></Grid>
                </Grid>
            </main>
        </MuiThemeProvider>
    );
}

export default App;
