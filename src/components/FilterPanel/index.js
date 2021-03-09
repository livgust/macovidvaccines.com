import { makeStyles } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import AvailabilityFilter from "./AvailabilityFilter";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import RadiusFilter from "./RadiusFilter";
import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ZipCodeFilter, { isZipValid } from "./ZipCodeFilter";

// any location with data older than this will not be displayed at all
export const tooStaleMinutes = 60; // unit in minutes

const leftPaddingSpacingCoefficient = 1.0;

const useStyles = makeStyles((theme) => ({
    mdPanel: {
        position: "sticky",
        top: 0,
        height: "200px",
    },
    drawerPaper: {
        width: theme.drawerWidth,
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
    filterGroup: {
        "border-style": "solid",
        "border-color": theme.palette.divider,
        "margin-left": theme.spacing(-leftPaddingSpacingCoefficient / 2),
        "padding-left": theme.spacing(leftPaddingSpacingCoefficient / 2),
    },
    filterSegment: {
        "padding-top": theme.spacing(1),
        "padding-bottom": theme.spacing(1),
    },
    panel: {
        "padding-left": theme.spacing(leftPaddingSpacingCoefficient),
    },
}));

export default function FilterPanelParent({
    mainContainer,
    anchor,
    mobileOpen,
    handleDrawerToggle,
    data,
    filters,
    setFilters,
}) {
    const classes = useStyles();

    const [inProgressFilters, setInProgressFilters] = useState({ ...filters });
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
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    <FilterPanel
                        data={data}
                        filters={inProgressFilters}
                        setFilters={setInProgressFilters}
                        closeButton={
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                    handleDrawerToggle(e);
                                    setFilters(inProgressFilters);
                                }}
                            >
                                Update List
                            </Button>
                        }
                        isMobile
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
                        filters={inProgressFilters}
                        setFilters={setInProgressFilters}
                        closeButton={
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.mobileButton}
                                onClick={() => setFilters(inProgressFilters)}
                                disabled={
                                    inProgressFilters.filterByZipCode.zipCode &&
                                    !isZipValid(
                                        inProgressFilters.filterByZipCode
                                            .zipCode
                                    )
                                }
                            >
                                Update List
                            </Button>
                        }
                    />
                </Drawer>
            </Hidden>
        </>
    );
}

function FilterSegment({ children }) {
    const classes = useStyles();
    return (
        <Grid item xs={12} className={classes.filterSegment}>
            {children}
        </Grid>
    );
}

function FilterGroup({ name, children }) {
    const classes = useStyles();
    return (
        <div className={classes.filterGroup}>
            <div className={classes.filterSegment}>
                <strong>{name}</strong>
            </div>
            {children}
        </div>
    );
}

function FilterPanel(props) {
    const { filters, setFilters, closeButton, isMobile } = props;

    const classes = useStyles();
    const theme = useTheme();
    const mdSize = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Grid
            container={true}
            className={`${classes.panel} ${mdSize ? classes.mdPanel : ""}`}
        >
            {isMobile && (
                <Typography variant="h6" component="span">
                    Filter
                </Typography>
            )}
            <FilterSegment>
                <AvailabilityFilter
                    onlyShowAvailable={filters.filterByAvailable}
                    onChange={(value) =>
                        setFilters({
                            ...filters,
                            filterByAvailable: value,
                        })
                    }
                />
            </FilterSegment>

            <FilterGroup name="Find Locations">
                <FilterSegment>
                    <ZipCodeFilter
                        zipCode={filters.filterByZipCode.zipCode}
                        onChange={(zip) =>
                            setFilters({
                                ...filters,
                                filterByZipCode: {
                                    ...filters.filterByZipCode,
                                    zipCode: zip,
                                },
                            })
                        }
                    />
                </FilterSegment>

                <FilterSegment>
                    <RadiusFilter
                        value={filters.filterByZipCode.miles}
                        onChange={(miles) =>
                            setFilters({
                                ...filters,
                                filterByZipCode: {
                                    ...filters.filterByZipCode,
                                    miles,
                                },
                            })
                        }
                    />
                </FilterSegment>
            </FilterGroup>

            <FilterSegment>{closeButton}</FilterSegment>
        </Grid>
    );
}
