import {
    createMuiTheme,
    makeStyles,
    MuiThemeProvider,
} from "@material-ui/core";
import Copyright from "./components/Copyright";
import Grid from "@material-ui/core/Grid";
import Menu from "./components/Menu";
import React from "react";
import themeTemplate from "./theme";
import Typography from "@material-ui/core/Typography";

const theme = createMuiTheme(themeTemplate);

const useStyles = makeStyles((theme) => ({
    main: {
        padding: theme.spacing(2),
    },
    heading: {
        "text-align": "center",
    },
}));

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <Menu />
            <MainComponent />
        </MuiThemeProvider>
    );
}

function MainComponent() {
    const classes = useStyles();

    return (
        <main className={classes.main}>
            <Grid container justify="center" spacing={3}>
                <Grid container id="main-container">
                    <Grid xs={1} md={2} />
                    <Grid xs={10} md={8}>
                        <h1 className={classes.heading}>MA Covid Vaccines</h1>
                        <h2>Thank you!</h2>
                        <Typography>
                            <a
                                href="/macovidvaccines_press_release_20210630.pdf"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Press Release - June 30, 2021
                            </a>
                        </Typography>
                        <br />
                        <Typography>
                            We are no longer reporting on vaccination
                            appointments because the supply has increased
                            dramatically. We’re proud to have helped so many
                            people in Massachusetts find appointments over the
                            last six months. Visit the official Massachusetts
                            Covid vaccine appointment finder at{" "}
                            <a
                                href="https://vaxfinder.mass.gov"
                                target="_blank"
                                rel="noreferrer"
                            >
                                vaxfinder.mass.gov
                            </a>{" "}
                            to schedule an appointment. Our friends at Mass
                            Covid Vaccination Help have great{" "}
                            <a
                                href="https://macovidvaxhelp.com/resources"
                                target="_blank"
                                rel="noreferrer"
                            >
                                tips to help you find an appointment
                            </a>
                            .
                        </Typography>
                        <br />
                        <img
                            src="/vaxfinder_screenshot.PNG"
                            alt="A map of COVID-19 vaccine providers across Massachusetts"
                            style={{ "max-width": "600px", width: "80%" }}
                        />
                        <br />
                        <Typography>
                            <i>
                                There are now hundreds of vaccination sites
                                across Massachusetts. See vaxfinder.mass.gov to
                                schedule an appointment.
                                <br />
                                <a
                                    href="https://www.mass.gov/info-details/covid-19-vaccination-locations"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Map source
                                </a>
                                , 16 June 2021
                            </i>
                        </Typography>
                        <br />
                        <Copyright />
                    </Grid>
                    <Grid xs={1} md={2} />
                </Grid>
            </Grid>
        </main>
    );
}

export default App;
