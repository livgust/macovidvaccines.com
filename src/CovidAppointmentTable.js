import React from "react";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import Availability from "./components/Availability";
import SignUpLink from "./components/SignUpLink";
import MoreInformation from "./components/MoreInformation";
import { sortData } from "./services/appointmentData.service";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import HelpDialog from "./components/HelpDialog";
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

    if (entry.restrictions) {
        hasRestriction = true;
        restrictionText = entry.restrictions;
    } else if (entry.extraData && entry.extraData["Additional Information"]) {
        const text = entry.extraData["Additional Information"];
        if (
            //"resident" " live" " work" "eligible populations in"
            text
                .toLowerCase()
                .match(/(resident|\slive|\swork|eligible\spopulations\sin)/)
        ) {
            hasRestriction = true;
            restrictionText = text;
        }
    }

    const classes = useStyles();
    return hasRestriction ? (
        <div className={classes.restrictionNotice}>
            <HelpDialog
                icon={ErrorOutlineIcon}
                iconProps={{ className: classes.restrictionIcon }}
                tooltipText={"This site may be restricted"}
                title="This site may be restricted"
                text={
                    <>
                        <p>
                            We have flagged this site as restricted based on the
                            following information (located under "MORE
                            INFORMATION"):
                        </p>
                        <p>"{restrictionText}"</p>
                    </>
                }
            />
            <Typography>May be restricted</Typography>
        </div>
    ) : null;
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
