/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import { makeStyles } from "@material-ui/core";
import { sortData } from "./services/appointmentData.service";
import Availability from "./components/Availability";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import HelpDialog from "./components/HelpDialog";
import MoreInformation from "./components/MoreInformation";
import React from "react";
import SignUpLink from "./components/SignUpLink";
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
        color: theme.palette.text.primary,
    },
    restrictionNoticeTooltip: {
        cursor: "pointer",
    },
    restrictionIcon: {
        color: theme.palette.warning.dark,
        "padding-right": theme.spacing(1),
    },
}));

export default function CovidAppointmentTable({ data }) {
    const classes = useStyles();

    const sortedData = sortData(data, {
        sortKey: "location",
        sortAsc: true,
    });

    // generate unique key for each site
    const getSiteId = (site) => {
        return btoa(
            JSON.stringify(site)
                .split("")
                .map((c) => c.charCodeAt(0).toString())
                .join("")
        );
    };

    return (
        <>
            {sortedData && sortedData.length ? (
                sortedData.map((entry) => {
                    return (
                        <LocationCard
                            entry={entry}
                            className={classes.cardBox}
                            key={getSiteId(entry)}
                        />
                    );
                })
            ) : (
                <div role="status">
                    <p>No appointments found.</p>
                </div>
            )}
        </>
    );
}

function RestrictionNotifier({ entry }) {
    let hasRestriction = false;
    let restrictionText = null;
    let definitiveRestriction = false;

    if (entry.restrictions) {
        definitiveRestriction = true;
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
                <ErrorOutlineIcon className={classes.restrictionIcon} />
                <Typography>{restrictionText}</Typography>
            </span>
        );
    } else {
        return (
            <HelpDialog
                className={`${classes.restrictionNotice} ${classes.restrictionNoticeTooltip}`}
                icon={ErrorOutlineIcon}
                iconProps={{ className: classes.restrictionIcon }}
                title="This site may be restricted"
                text={
                    <>
                        <p className={classes.restrictionNotice}>
                            "{restrictionText}"
                        </p>
                        <p>
                            We have flagged this site as restricted based on the
                            above information (located under "MORE
                            INFORMATION").
                        </p>
                    </>
                }
            >
                <Typography>May be restricted</Typography>
            </HelpDialog>
        );
    }
}

function LocationCard({ entry, className }) {
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
                            <RestrictionNotifier entry={entry} />
                            <div>{entry.city}</div>
                            <StaleDataIndicator timestamp={entry.timestamp} />
                        </>
                    }
                />
                <CardContent>
                    <Availability entry={entry} />
                    <MoreInformation entry={entry} />
                    <SignUpLink entry={entry} />
                </CardContent>
            </Card>
        </div>
    );
}
