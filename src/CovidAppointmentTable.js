/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import { makeStyles } from "@material-ui/core";
import Availability from "./components/Availability";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import HelpDialog from "./components/HelpDialog";
import Loader from "react-loader";
import MoreInformation from "./components/MoreInformation";
import React, { useState, useEffect } from "react";
import SignUpLink from "./components/SignUpLink";
import StaleDataIndicator from "./components/StaleDataIndicator";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";

export function transformData(data) {
    return data.map((entry, index) => {
        return {
            key: index,
            location: entry.name,
            streetAddress: entry.street,
            city: entry.city,
            zip: entry.zip,
            hasAppointments: entry.hasAvailability,
            appointmentData: entry.availability || null,
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
    const tooStaleMinutes = 60;
    const oldestGoodTimestamp = new Date() - (tooStaleMinutes * 60 * 1000);

    const filteredData = onlyShowAvailable
        ? data.filter((entry) => (entry.hasAppointments && entry.timestamp >= oldestGoodTimestamp))
        : data.filter((entry) => (entry.timestamp >= oldestGoodTimestamp));

    const newData = filteredData.sort((a, b) => {
        const first = sortAsc ? a[sortKey] : b[sortKey];
        const second = sortAsc ? b[sortKey] : a[sortKey];
        if (typeof first == "string") {
            return first.localeCompare(second);
        } else {
            return first - second;
        }
    });
    return newData;
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

export default function CovidAppointmentTable() {
    const classes = useStyles();

    const [data, setData] = useState([]);
    const [ready, setReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [sortInfo, setSortInfoIgnored] = useState({
        sortKey: "location",
        sortAsc: true,
    });

    const [onlyShowAvailable, setOnlyShowAvailable] = useState(true);

    useEffect(() => {
        fetch("https://mzqsa4noec.execute-api.us-east-1.amazonaws.com/prod")
            .then(async (res) => {
                const newData = await res.json();
                setData(JSON.parse(newData.body).results);
                setReady(true);
            })
            .catch((ex) => {
                console.error(ex.message);
                setErrorMessage(
                    "something went wrong, please try again later."
                );
                setReady(true);
            });
    }, []);

    const formattedData = sortAndFilterData(
        transformData(data),
        sortInfo,
        onlyShowAvailable
    );

    return (
        <>
            <div
                aria-label="loading data"
                id="progress"
                role="progressbar"
                aria-valuetext={ready ? "loaded" : "waiting"}
            >
                <Loader loaded={ready} />
            </div>

            {errorMessage && <div role="alert">{errorMessage}</div>}

            <section aria-live="polite" aria-busy={!ready}>
                <FormControlLabel
                    control={
                        <Switch
                            aria-checked={onlyShowAvailable}
                            role="switch"
                            checked={onlyShowAvailable}
                            onChange={(event) =>
                                setOnlyShowAvailable(event.target.checked)
                            }
                        />
                    }
                    label="Only show locations with available appointments"
                />
                {ready && formattedData.length === 0 && (
                    <div role="status">
                        <p>No appointments found.</p>
                    </div>
                )}
                <div role="list">
                    {formattedData.map((entry) => (
                        <LocationCard
                            entry={entry}
                            className={classes.cardBox}
                            key={`${entry.location}-${entry.streetAddress}-${entry.city}`}
                        />
                    ))}
                </div>
            </section>
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
                <ErrorOutlineIcon fontSize="small" className={classes.restrictionIcon} />
                <Typography className={classes.restrictionWarning}>{restrictionText}</Typography>
            </span>
        );
    } else {
        return (
            <HelpDialog
                className={`${classes.restrictionNotice} ${classes.restrictionNoticeTooltip}`}
                icon={ErrorOutlineIcon}
                iconProps={{ className: classes.restrictionIcon }}
                text={
                    <p className={classes.restrictionNotice}>{restrictionText}</p>
                }
            >
                <Typography className={classes.restrictionWarning}>Important Eligibility Notice</Typography>
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
