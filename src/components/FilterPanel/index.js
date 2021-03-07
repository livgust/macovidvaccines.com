/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { convertDistance, getDistance } from "geolib";
import { setSortBy } from "../../services/appointmentData.service";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import AvailabilityFilter, {
    filterData as filterAvailability,
} from "./AvailabilityFilter";
import ZipCodeFilter from "./ZipCodeFilter";

// For performance, use a pared down list of Mass. zipcodes only (saves 374K or 60% of size!)
// const zipcodeData = require("us-zips");
import zipcodeData from "../../generated/ma-zips.json";

const drawerWidth = 300;

// any location with data older than this will not be displayed at all
export const tooStaleMinutes = 60; // unit in minutes

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(3),
    },
    mdPanel: {
        position: "sticky",
        top: 0,
        height: "200px",
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
}));

export default function FilterPanelParent({
    mainContainer,
    anchor,
    mobileOpen,
    handleDrawerToggle,
    data,
    setFilters,
    onlyShowAvailable,
    setOnlyShowAvailable,
    zipCode,
    setZipCode,
    closeButton,
}) {
    const classes = useStyles();
    return (
        <>
            <Hidden mdUp implementation="css">
                <Drawer
                    container={mainContainer}
                    variant="temporary"
                    anchor={anchor}
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
                        closeButton={closeButton}
                    />
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
        </>
    );
}

function FilterPanel(props) {
    const {
        dataIgnored,
        onChange,
        onlyShowAvailable,
        setOnlyShowAvailable,
        zipCode,
        setZipCode,
        closeButton,
    } = props;

    const classes = useStyles();
    const theme = useTheme();
    const mdSize = useMediaQuery(theme.breakpoints.up("md"));

    const [zipCodeFilter, setZipcodeFilter] = useState({
        zipCode: zipCode,
        miles: 9999,
    });
    useEffect(() => {
        onChange({
            hasAppointments: (d) => !onlyShowAvailable || filterAvailability(d),
            zipcode: (d) => {
                if (d) {
                    const zipValid = zipCodeFilter.zipCode.match(/\d{5}/);
                    if (zipValid) {
                        const myCoordinates =
                            zipcodeData[zipCodeFilter.zipCode];
                        if (myCoordinates) {
                            setSortBy("miles");
                            d.miles = Math.round(
                                convertDistance(
                                    getDistance(
                                        myCoordinates,
                                        d.coordinates,
                                        1
                                    ),
                                    "mi"
                                )
                            );

                            // Is the location within the range specified?
                            return d.miles <= zipCodeFilter.miles;
                        }
                    }
                }
                // No zipcode was provided or
                // was unable to find coordinates for the specified zipcode
                setSortBy("location");
                return true;
            },
        });
    }, [onChange, onlyShowAvailable, zipCodeFilter]);

    return (
        <Grid container={true} className={mdSize ? classes.mdPanel : ""}>
            <Container>
                <Typography component="span">
                    <h3>Filter by:</h3>
                </Typography>
            </Container>

            <Grid item xs={12}>
                <AvailabilityFilter
                    onlyShowAvailable={onlyShowAvailable}
                    setOnlyShowAvailable={setOnlyShowAvailable}
                    onChange={(isChecked) => {
                        setOnlyShowAvailable(isChecked);
                    }}
                />
            </Grid>

            <Grid item xs={12}>
                <ZipCodeFilter
                    zipCode={zipCode}
                    onChange={(zip) => {
                        setZipCode(zip);
                        setZipcodeFilter({ ...zipCode, zipCode: zip });
                    }}
                    className={classes.formControl}
                />
            </Grid>

            <Grid item xs={12}>
                {closeButton}
            </Grid>
        </Grid>
    );
}
