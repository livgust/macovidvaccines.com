import { makeStyles } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import AvailabilityFilter from "./AvailabilityFilter";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ZipCodeFilter from "./ZipCodeFilter";

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
    drawerMobile: {},
    mobileButton: { width: "50%", marginLeft: theme.spacing(3) },
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
                    className={classes.drawerMobile}
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
                                className={classes.mobileButton}
                                onClick={(e) => {
                                    handleDrawerToggle(e);
                                    setFilters(inProgressFilters);
                                }}
                            >
                                Update List
                            </Button>
                        }
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

function FilterPanel(props) {
    const { filters, setFilters, closeButton } = props;

    const classes = useStyles();
    const theme = useTheme();
    const mdSize = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Grid container={true} className={mdSize ? classes.mdPanel : ""}>
            <Container>
                <Typography component="span">
                    <h3>Filter by:</h3>
                </Typography>
            </Container>

            <Grid item xs={12}>
                <AvailabilityFilter
                    onlyShowAvailable={filters.filterByAvailable}
                    onChange={(value) =>
                        setFilters({
                            ...filters,
                            filterByAvailable: value,
                        })
                    }
                />
            </Grid>

            <Grid item xs={12}>
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
                    className={classes.formControl}
                />
            </Grid>

            <Grid item xs={12}>
                {closeButton}
            </Grid>
        </Grid>
    );
}
