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
import { isZipValid } from "./components/FilterPanel/ZipCodeFilter";
import { getCookie, setCookie } from "./services/cookie.service";
import { useTranslation } from "react-i18next";
import Alert from "@material-ui/lab/Alert";
import AlertBanner from "./components/AlertBanner";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Button from "@material-ui/core/Button";
import CovidAppointmentTable from "./CovidAppointmentTable";
import Copyright from "./components/Copyright";
import FilterListIcon from "@material-ui/icons/FilterList";
import FilterPanel from "./components/FilterPanel";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Loader from "react-loader";
import Menu from "./components/Menu";
import NotificationsDialog from "./components/NotificationsDialog";
import React, { useEffect, useState } from "react";
import StateEligibility from "./components/StateEligibility";
import themeTemplate from "./theme";

const theme = createMuiTheme(themeTemplate);

const useStyles = makeStyles((theme) => ({
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
}));

function App({ zipParam }) {
    return (
        <MuiThemeProvider theme={theme}>
            <Menu />
            <MainComponent zipParam={zipParam} />
        </MuiThemeProvider>
    );
}

function ErrorMessageAlert({ message }) {
    const { t } = useTranslation("main");
    //const classes = useStyles();
    return (
        <>
            <Alert severity={"error"}>
                <AlertTitle>{t("error_alert_title")}</AlertTitle>
                <p>{message}</p>
            </Alert>
            <br />
        </>
    );
}

function MainComponent({ zipParam }) {
    const { t } = useTranslation("main");
    const classes = useStyles();
    const mainContainer = document.getElementById("main-container");
    const [data, setData] = useState([]);
    const [ready, setReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    let filterCookies = getCookie("filter");

    // Check for a valid ZIP Code parameter.
    if (zipParam && isZipValid(zipParam)) {
        // If there was a ZIP Code parameter passed in, update the cookie if it exists
        if (filterCookies?.filterByZipCode) {
            filterCookies.filterByZipCode.zipCode = zipParam;
            setCookie("filter", filterCookies);
        }
    } else {
        // Missing or Invalid zip, then just default to no ZIP Code
        zipParam = "";
    }

    // UX change removed 5 mile radius as an option so this will set cookies
    // previously set to 5 to the next smallest, 10
    // TODO: undo this snippet after sufficient time has passed
    if (filterCookies?.filterByZipCode?.miles === 5) {
        filterCookies.filterByZipCode.miles = 10;
        setCookie("filter", filterCookies);
    }

    const [filters, setFilters] = useState({
        filterByAvailable: true,
        filterByMassVax: true,
        filterByZipCode: { zipCode: zipParam, miles: 9999 },
        ...filterCookies,
    });

    const zip = filters.filterByZipCode.zipCode;
    const sortBy = zip && isZipValid(zip) ? "miles" : "location";

    const readError = t("read_error");
    useEffect(() => {
        getAppointmentData()
            .then(async (res) => {
                setData(res);
                setReady(true);
            })
            .catch((ex) => {
                console.log(ex); // full traceback for diagnostics
                console.error(ex.message);
                setErrorMessage(readError);
                setReady(true);
            });
    }, [readError]);

    const { filteredData, showingUnfilteredData } = filterData(data, filters);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <main className={classes.main}>
            <NotificationsDialog
                open={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
            />
            <Grid container justify="center" spacing={3}>
                <Grid container id="main-container">
                    <FilterPanel
                        mainContainer={mainContainer}
                        anchor={theme.direction === "rtl" ? "right" : "left"}
                        mobileOpen={mobileOpen}
                        handleDrawerToggle={handleDrawerToggle}
                        filters={filters}
                        setFilters={setFilters}
                    />
                    <Grid className={classes.content}>
                        <h1 className={classes.heading}>{t("page_title")}</h1>
                        <Grid container justify="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setNotificationsOpen(true)}
                                style={{ align: "center" }}
                            >
                                {t("button.enroll_txt")}
                            </Button>
                        </Grid>
                        <br />
                        <AlertBanner />
                        <StateEligibility />
                        <Hidden mdUp implementation="css">
                            <Button
                                variant="contained"
                                startIcon={<FilterListIcon />}
                                onClick={handleDrawerToggle}
                            >
                                {t("filter.mobile_button")}
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
                                        onlyShowAvailable={
                                            filters.filterByAvailable
                                        }
                                        showingUnfilteredData={
                                            showingUnfilteredData
                                        }
                                        filterMiles={
                                            filters.filterByZipCode.miles
                                        }
                                        sortBy={sortBy}
                                    />
                                )}
                            </Loader>
                        </div>
                        <Copyright />
                    </Grid>
                </Grid>
            </Grid>
        </main>
    );
}

export default App;
