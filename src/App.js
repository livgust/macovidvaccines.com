/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import {
    createMuiTheme,
    makeStyles,
    MuiThemeProvider,
} from "@material-ui/core";
import {
    filterData,
    getAppointmentData,
} from "./services/appointmentData.service";
import {
    getZipCodeCookie,
    isZipValid,
} from "./components/FilterPanel/ZipCodeFilter";
import { setSortBy } from "./services/appointmentData.service";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Button from "@material-ui/core/Button";
import CovidAppointmentTable from "./CovidAppointmentTable";
import FilterListIcon from "@material-ui/icons/FilterList";
import FilterPanel from "./components/FilterPanel";
import Grid from "@material-ui/core/Grid";
//import { Alert, AlertTitle } from "@material-ui/lab";
import Hidden from "@material-ui/core/Hidden";
import Loader from "react-loader";
import Menu from "./components/Menu";
import React, { useEffect, useState } from "react";
import StateEligibility from "./components/StateEligibility";
import Typography from "@material-ui/core/Typography";
import themeTemplate from "./theme";

/* Alert to put under page title when necessary
const alert = new Date() > new Date("2021-03-04T06:00:00-05:00") && (
    <>
        <Alert severity="warning">
            <AlertTitle>Thursday, March 4</AlertTitle>
            Due to high demand, the MA vaccination websites are experiencing
            technical difficulties. Once the issues are resolved, their
            locations will appear on this website.
        </Alert>
        <br />
    </>
);
*/

const theme = createMuiTheme(themeTemplate);

const useStyles = makeStyles((theme) => {
    console.log("DRAWERWIDTH USESTYLES");
    console.log(theme.drawerWidth);
    return {
        main: {
            padding: theme.spacing(2),
        },
        heading: {
            "text-align": "center",
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            [theme.breakpoints.up("md")]: {
                width: `calc(100% - ${theme.drawerWidth}px)`,
                marginLeft: theme.drawerWidth,
                borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            },
        },
    };
});

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <Menu />
            <MainComponent />
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

function MainComponent() {
    const classes = useStyles();
    const mainContainer = document.getElementById("main-container");
    const [data, setData] = useState([]);
    const [ready, setReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const [filters, setFilters] = useState({
        filterByAvailable: true,
        filterByZipCode: { zipCode: getZipCodeCookie(), miles: 9999 },
    });

    useEffect(() => {
        getAppointmentData()
            .then(async (res) => {
                setData(res);
                setReady(true);
            })
            .catch((ex) => {
                console.log(ex); // full traceback for diagnostics
                console.error(ex.message);
                setErrorMessage(
                    "Something went wrong, please try again later."
                );
                setReady(true);
            });
    }, []);

    useEffect(() => {
        isZipValid(filters.filterByZipCode.zipCode)
            ? setSortBy("miles")
            : setSortBy("name");
    }, [filters]);

    const filteredData = filterData(data, filters);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <main className={classes.main}>
            <Grid container justify="center" spacing={3}>
                <Grid container id="main-container">
                    <FilterPanel
                        mainContainer={mainContainer}
                        anchor={theme.direction === "rtl" ? "right" : "left"}
                        mobileOpen={mobileOpen}
                        handleDrawerToggle={handleDrawerToggle}
                        data={data}
                        filters={filters}
                        setFilters={setFilters}
                    />
                    <Grid className={classes.content}>
                        <h1 className={classes.heading}>
                            MA Covid Vaccine Appointments
                        </h1>
                        <StateEligibility />
                        <Hidden mdUp implementation="css">
                            <Button
                                variant="contained"
                                startIcon={<FilterListIcon />}
                                onClick={handleDrawerToggle}
                            >
                                Filter Locations
                            </Button>{" "}
                        </Hidden>
                        <div
                            aria-label="loading data"
                            id="progress"
                            role="progressbar"
                            aria-valuetext={ready ? "loaded" : "waiting"}
                        >
                            <Loader loaded={ready}>
                                {errorMessage ? (
                                    <ErrorMessageAlert message={errorMessage} />
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
                </Grid>
            </Grid>
        </main>
    );
}

export default App;
