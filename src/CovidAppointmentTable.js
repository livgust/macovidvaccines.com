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
import SignUpLink, { hasSignUpLink } from "./components/SignUpLink";
import { sortData } from "./services/appointmentData.service";
import StaleDataIndicator from "./components/StaleDataIndicator";
import Typography from "@material-ui/core/Typography";

const dayjs = require("dayjs");

// any location with data older than this will not be displayed at all
export const tooStaleMinutes = 60; // unit in minutes

export function transformData(data) {
    const ourDateFormat = "M/D/YY"; // 3/2
    // future format?    "ddd, MMM D"; // Tue Mar 2

    return data.map((entry, index) => {
        let availability = [];
        if (entry.availability) {
            for (const [key, value] of Object.entries(entry.availability)) {
                let newKey = dayjs(key).format(ourDateFormat);
                availability[newKey] = value;
            }
        }

        return {
            key: index,
            location: entry.name,
            streetAddress: entry.street,
            city: entry.city,
            zip: entry.zip,
            hasAppointments: entry.hasAvailability,
            appointmentData: availability || null,
            signUpLink: entry.signUpLink || null,
            extraData: entry.extraData || null,
            restrictions: entry.restrictions || null,
            timestamp: entry.timestamp ? new Date(entry.timestamp) : null,
        };
    });
}

export function sortAndFilterData(
    data,
    { sortKey, sortAsc },
    onlyShowAvailable
) {
    // Filter the locations that have "non-stale" data
    const oldestGoodTimestamp = new Date() - tooStaleMinutes * 60 * 1000;
    let filteredData = data.filter(
        ({ timestamp }) => !timestamp || timestamp >= oldestGoodTimestamp
    );

    // Filter only the locations that have a sign up link, if desired
    if (onlyShowAvailable) {
        filteredData = filteredData.filter((entry) => hasSignUpLink(entry));
    }

    // Sort the data
    return filteredData.sort((a, b) => {
        const first = sortAsc ? a[sortKey] : b[sortKey];
        const second = sortAsc ? b[sortKey] : a[sortKey];
        if (typeof first == "string") {
            return first.localeCompare(second);
        } else {
            return first - second;
        }
    });
}

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

function convertExtraDataToRestrictions(additionalInfo) {
    const text = additionalInfo;
    if (
        // "County residents"
        // "eligible residents"
        // " live"
        // " work"
        // "eligible populations in"
        // "k-12"
        text
            .toLowerCase()
            .match(
                /(county\sresidents|eligible\sresidents|\slive|\swork|eligible\spopulations\sin|k-12)/
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
