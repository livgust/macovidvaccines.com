import React, { useEffect, useState } from "react";
import Loader from "react-loader";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { Button, makeStyles, MuiThemeProvider } from "@material-ui/core";

import theme from "./theme";
import CovidAppointmentTable from "./CovidAppointmentTable";
import Menu from "./components/Menu";
import StateEligibility from "./components/StateEligibility";
import FilterPanel from "./components/FilterPanel";
import {
    filterData,
    getAppointmentData,
} from "./services/appointmentData.service";


const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
    main: {
        padding: theme.spacing(2),
    },
    heading: {
        "text-align": "center",
    },
    drawer: {
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up('md')]: {
            top: '70px',
            height: 'calc(100% - 70px)',
            border: 'none'
        },
        [theme.breakpoints.down('sm')]: {
            top: 0,
            height: '100% ',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)'
        },

    },
    drawerMobile: {

    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            borderLeft: '1px solid rgba(0, 0, 0, 0.12)'
        },
    },
}));

function App() {
    const classes = useStyles();

    const [data, setData] = useState([]);
    const [ready, setReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [filters, setFilters] = useState({});
    const [mobileOpen, setMobileOpen] = React.useState(false);

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

    const mainContainer = document.getElementById('main-container');

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
                                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                                open={mobileOpen}
                                onClose={handleDrawerToggle}
                                classes={{
                                    paper: classes.drawerPaper
                                }}
                                className={classes.drawerMobile}
                                ModalProps={{
                                    keepMounted: true, // Better open performance on mobile.
                                }}
                            >
                                <FilterPanel data={data} onChange={setFilters} />
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
                                <FilterPanel data={data} onChange={setFilters} />
                            </Drawer>
                        </Hidden>
                        <Grid className={classes.content}>
                            <h1 className={classes.heading}>
                                MA Covid Vaccine Appointments
                            </h1>
                            <StateEligibility />
                            <Hidden mdUp implementation="css">
                                <Button
                                    onClick={handleDrawerToggle}
                                >
                                    {/* TODO THIS IS UGLY */}
                                    {'<<< '}Filter Sites
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
                                        <div role="alert">{errorMessage}</div>
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
        </MuiThemeProvider>
    );
}

export default App;
