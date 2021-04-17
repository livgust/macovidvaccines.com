/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Availability from "./components/Availability";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import HelpDialog from "./components/HelpDialog";
import { makeStyles } from "@material-ui/core";
import MoreInformation from "./components/MoreInformation";
import React from "react";
import SignUpLink from "./components/SignUpLink";
import { sortData } from "./services/appointmentData.service";
import StaleDataIndicator from "./components/StaleDataIndicator";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { getCookie, setCookie } from "./services/cookie.service";

const useStyles = makeStyles((theme) => ({
    cardBox: {
        "padding-top": theme.spacing(2),
        "padding-bottom": theme.spacing(2),
    },
    restrictionNotice: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        fontWeight: "bold",
        color: theme.palette.text.primary,
    },
    restrictionNoticeTooltip: {
        cursor: "pointer",
    },
    restrictionWarning: {
        color: theme.palette.error.dark,
    },
    restrictionIcon: {
        color: theme.palette.error.dark,
        "padding-right": theme.spacing(1),
    },
    massVaxBoxHeader: {
        paddingBottom: 0,
    },
    massVaxBox: {},
}));

export default function CovidAppointmentTable({
    data,
    sortBy,
    onlyShowAvailable,
    showingUnfilteredData,
    filterMiles,
}) {
    const classes = useStyles();

    const sortedData = sortData(data, sortBy);

    // generate unique key for each site
    const getSiteId = (site) => {
        return btoa(
            JSON.stringify(site)
                .split("")
                .map((c) => c.charCodeAt(0).toString())
                .join("")
        );
    };

    if (sortedData && sortedData.length) {
        return (
            <div role="list">
                <MassVaxCard className={classes.cardBox} />
                <ShowingUnfilteredData
                    showingUnfilteredData={showingUnfilteredData}
                    miles={filterMiles}
                />
                {sortedData.map((entry) => {
                    return (
                        <LocationCard
                            entry={entry}
                            className={classes.cardBox}
                            key={getSiteId(entry)}
                            showMiles={sortBy === "miles"}
                            milesLimit={filterMiles}
                            onlyShowAvailable={onlyShowAvailable}
                        />
                    );
                })}
            </div>
        );
    } else {
        return (
            <div role="list">
                <MassVaxCard className={classes.cardBox} />
                <NoAppointmentsAlert />
            </div>
        );
    }
}

function convertExtraDataToRestrictions(additionalInfo) {
    const text = additionalInfo;
    if (
        // "County residents"
        // "eligible residents"
        // " live"
        // " work"
        // "eligible populations in"
        // "k-12"
        // "teacher"
        text
            .toLowerCase()
            .match(
                /(county\sresidents|eligible\sresidents|\slive|\swork|eligible\spopulations\sin|k-12|teacher)/
            )
    ) {
        return {
            hasRestriction: true,
            restrictionText: text,
        };
    } else {
        return {};
    }
}

function RestrictionNotifier({ entry }) {
    let hasRestriction = false;
    let restrictionText = null;
    let definitiveRestriction = false;

    if (entry.restrictions) {
        //if the restrictions text is long, put it behind a dialog
        definitiveRestriction = entry.restrictions.length <= 50;
        hasRestriction = true;
        restrictionText = entry.restrictions;
    } else if (entry.extraData && entry.extraData["Additional Information"]) {
        const restrictions = convertExtraDataToRestrictions(
            entry.extraData["Additional Information"]
        );
        hasRestriction = restrictions.hasRestriction;
        restrictionText = restrictions.restrictionText;
    }

    const classes = useStyles();
    if (!hasRestriction) {
        return null;
    } else if (definitiveRestriction) {
        return (
            <span className={classes.restrictionNotice}>
                <ErrorOutlineIcon
                    fontSize="small"
                    className={classes.restrictionIcon}
                />
                <Typography className={classes.restrictionWarning}>
                    {restrictionText}
                </Typography>
            </span>
        );
    } else {
        return (
            <HelpDialog
                className={`${classes.restrictionNotice} ${classes.restrictionNoticeTooltip}`}
                icon={ErrorOutlineIcon}
                iconProps={{ className: classes.restrictionIcon }}
                text={
                    <p className={classes.restrictionNotice}>
                        {restrictionText}
                    </p>
                }
            >
                <Typography className={classes.restrictionWarning}>
                    Information about eligibility
                </Typography>
            </HelpDialog>
        );
    }
}

function LocationCard({ entry, className, onlyShowAvailable, showMiles }) {
    const classes = useStyles();
    return (
        <div role="listitem" className={className}>
            <Card>
                <CardHeader
                    title={
                        <div className={classes.locationTitle}>
                            <span>{entry.location}</span>
                        </div>
                    }
                    subheader={
                        <>
                            <div>
                                {entry.city}{" "}
                                {showMiles &&
                                    entry.miles &&
                                    `(${entry.miles} miles)`}
                            </div>
                            <RestrictionNotifier entry={entry} />
                            <StaleDataIndicator timestamp={entry.timestamp} />
                        </>
                    }
                />
                <CardContent>
                    <Availability
                        entry={entry}
                        onlyShowAvailable={onlyShowAvailable}
                    />
                    <MoreInformation entry={entry} />
                    <SignUpLink entry={entry} />
                </CardContent>
            </Card>
        </div>
    );
}

function MassVaxCard({ className }) {
    const classes = useStyles();

    if (getCookie("hideMassVax")) {
        return null;
    }

    function dismissMassVax() {
        setCookie("hideMassVax", true);
        document.getElementById("MassVaxCard").hidden = true;
    }

    return (
        <div id="MassVaxCard" role="listitem" className={className}>
            <Card className={classes.massVaxBox}>
                <CardHeader
                    className={classes.massVaxBoxHeader}
                    title={
                        <div className={classes.locationTitle}>
                            <span>Preregister for Mass Vaccination Sites</span>
                        </div>
                    }
                    subheader={
                        <>
                            <div>Numerous Locations across Massachusetts</div>
                        </>
                    }
                />
                <CardContent>
                    The Commonwealth’s{" "}
                    <a
                        href="https://www.mass.gov/info-details/preregister-for-a-covid-19-vaccine-appointment"
                        rel="noreferrer"
                        target="_blank"
                    >
                        preregistration system
                    </a>{" "}
                    helps you get an appointment at one of the many mass
                    vaccination locations and regional collaboratives near you.
                    You’ll receive weekly status updates, and you may opt out at
                    any time if you find an appointment elsewhere.
                    <p>
                        We recommend preregistering <i>and</i> using this site
                        &mdash; you may find an appointment at locations not
                        covered by preregistration.
                    </p>
                    <Button
                        variant="contained"
                        color="primary"
                        href="https://www.mass.gov/info-details/preregister-for-a-covid-19-vaccine-appointment"
                        rel="noreferrer"
                        target="_blank"
                    >
                        Preregister at mass.gov
                    </Button>{" "}
                    <Button
                        variant="outlined"
                        color="default"
                        style={{ marginLeft: "5px" }}
                        onClick={dismissMassVax}
                        rel="noreferrer"
                        target="_blank"
                    >
                        Dismiss this reminder
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

function NoAppointmentsAlert() {
    //const classes = useStyles();
    return (
        <div role="status">
            <br />
            <Alert severity={"info"}>
                <AlertTitle>No Appointments Found</AlertTitle>
                <p>
                    None of the vaccine sites that we monitor currently have
                    available appointments. This website gathers data every
                    minute from COVID-19 vaccine sites across Massachusetts.
                </p>
                <p>
                    Check back for updated information. For more information on
                    the vaccine rollout in Massachusetts, visit{" "}
                    <a
                        href="https://www.mass.gov/covid-19-vaccine"
                        target="_blank"
                        rel="noreferrer"
                    >
                        www.mass.gov/covid-19-vaccine
                    </a>
                    .
                </p>
            </Alert>
            <br />
        </div>
    );
}

function ShowingUnfilteredData({ showingUnfilteredData, miles }) {
    //const classes = useStyles();
    if (!showingUnfilteredData) return null;
    return (
        <div role="status">
            <br />
            <Alert severity={"warning"}>
                <AlertTitle>
                    No Appointments Found Within {miles} Miles
                </AlertTitle>
                <p>
                    The following locations have appointments, but they are
                    farther than the {miles} mile limit you specified. This
                    website gathers data every minute from COVID-19 vaccine
                    sites across Massachusetts.
                </p>
            </Alert>
            <br />
        </div>
    );
}
