/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { Button, makeStyles, MuiThemeProvider } from "@material-ui/core";
import CovidAppointmentTable from "./CovidAppointmentTable";
import Drawer from "@material-ui/core/Drawer";
import FilterPanel, { getZipCodeCookie } from "./components/FilterPanel";
import {
    filterData,
    getAppointmentData,
} from "./services/appointmentData.service";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Loader from "react-loader";
import Menu from "./components/Menu";
import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import theme from "./theme";
import StateEligibility from "./components/StateEligibility";

const drawerWidth = 300;

/* Alert to put under page title when necessary
const alert = (
    <>
        <Alert severity="warning">
            <AlertTitle>8:08am Thursday, February 25</AlertTitle>
            The high demand for appointments right now is causing delays in
            collecting data. We will report up-to-the-minute availability when
            wait times decrease. We apologize for the inconvenience.
        </Alert>
        <br />
    </>
); */

const useStyles = makeStyles((theme) => ({
    main: {
        padding: theme.spacing(2),
    },
    heading: {
        "text-align": "center",
    },
    drawer: {
        [theme.breakpoints.up("md")]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up("md")]: {
            top: "70px",
            height: "calc(100% - 70px)",
            border: "none",
        },
        [theme.breakpoints.down("sm")]: {
            top: 0,
            height: "100% ",
            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        },
    },
    drawerMobile: {},
    mobileButton: { width: "50%" },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        [theme.breakpoints.up("md")]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
        },
    },
}));

function App() {
    const classes = useStyles();

    const [data, setData] = useState([]);
    const [ready, setReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    // State variables for the two FilterPanels so that both update together
    const [filters, setFilters] = useState({});
    const [onlyShowAvailable, setOnlyShowAvailable] = useState(true);
    const [zipCode, setZipCode] = useState(getZipCodeCookie());

    useEffect(() => {
        getAppointmentData()
            .then(async (res) => {
                setData(res);
                setReady(true);
            })
            .catch((ex) => {
                console.error(ex.message);
                setErrorMessage(
                    "Something went wrong, please try again later."
                );
                setReady(true);
            });
    }, []);

    const filteredData = filterData(data, filters);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const mainContainer = document.getElementById("main-container");

    return (
        <MuiThemeProvider theme={theme}>
            <Menu />
            <main className={classes.main}>
                <Grid container justify="center" spacing={3}>
                    <Grid container id="main-container">
                        <Hidden mdUp implementation="css">
                            <Drawer
                                container={mainContainer}
                                variant="temporary"
                                anchor={
                                    theme.direction === "rtl" ? "right" : "left"
                                }
                                open={mobileOpen}
                                onClose={handleDrawerToggle}
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                                className={classes.drawerMobile}
                                ModalProps={{
                                    keepMounted: true, // Better open performance on mobile.
                                }}
                            >
                                <FilterPanel
                                    data={data}
                                    onChange={setFilters}
                                    onlyShowAvailable={onlyShowAvailable}
                                    setOnlyShowAvailable={setOnlyShowAvailable}
                                    zipCode={zipCode}
                                    setZipCode={setZipCode}
                                ></FilterPanel>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.mobileButton}
                                    onClick={handleDrawerToggle}
                                >
                                    Update List
                                </Button>
                            </Drawer>
                        </Hidden>

                        <Hidden smDown implementation="css">
                            <Drawer
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                                variant="permanent"
                                open
                            >
                                <FilterPanel
                                    data={data}
                                    onChange={setFilters}
                                    onlyShowAvailable={onlyShowAvailable}
                                    setOnlyShowAvailable={setOnlyShowAvailable}
                                    zipCode={zipCode}
                                    setZipCode={setZipCode}
                                />
                            </Drawer>
                        </Hidden>
                        <Grid className={classes.content}>
                            <h1 className={classes.heading}>
                                MA Covid Vaccine Appointments
                            </h1>
                            <StateEligibility />
                            <Hidden mdUp implementation="css">
                                <Button
                                    variant="contained"
                                    startIcon={<ArrowBack />}
                                    onClick={handleDrawerToggle}
                                >
                                    {/* TODO THIS IS UGLY */}
                                    Filter Locations
                                </Button>
                            </Hidden>
                            <div
                                aria-label="loading data"
                                id="progress"
                                role="progressbar"
                                aria-valuetext={ready ? "loaded" : "waiting"}
                            >
                                <Loader loaded={ready}>
                                    {errorMessage ? (
                                        <ErrorMessageAlert
                                            message={errorMessage}
                                        />
                                    ) : (
                                        <CovidAppointmentTable
                                            data={filteredData}
                                        />
                                    )}
                                </Loader>
                            </div>
                            <Typography
                                variant="caption"
                                display="block"
                                gutterBottom
                            >
                                This site is not affiliated with or endorsed by
                                the Commonwealth of Massachusetts.
                                <br />
                                This site is for informational purposes only.
                                Not all vaccination locations are tracked and
                                the information may not be complete or accurate.
                                <br />
                                Copyright &#169; {new Date().getFullYear()}{" "}
                                Olivia Adams/Ora Innovations LLC. All rights
                                reserved.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </main>
        </MuiThemeProvider>
    );
}

function ErrorMessageAlert({ message }) {
    //const classes = useStyles();
    return (
        <>
            <Alert severity={"error"}>
                <AlertTitle>Unexpected Internal Error</AlertTitle>
                <p>{message}</p>
            </Alert>
            <br />
        </>
    );
}

export default App;
