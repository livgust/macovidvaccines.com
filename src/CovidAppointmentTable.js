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
}));

export default function CovidAppointmentTable({
    data,
    sortBy,
    onlyShowAvailable,
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
                {sortedData.map((entry) => {
                    return (
                        <LocationCard
                            entry={entry}
                            className={classes.cardBox}
                            key={getSiteId(entry)}
                            showMiles={sortBy === "miles"}
                            onlyShowAvailable={onlyShowAvailable}
                        />
                    );
                })}
            </div>
        );
    } else {
        return <NoAppointmentsAlert />;
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
        const text = entry.extraData["Additional Information"];
        if (
            // "County residents"
            // "eligible residents"
            // " live"
            // " work"
            // "eligible populations in"
            text
                .toLowerCase()
                .match(
                    /(county\sresidents|eligible\sresidents|\slive|\swork|eligible\spopulations\sin)/
                )
        ) {
            hasRestriction = true;
            restrictionText = text;
        }
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
