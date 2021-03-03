/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import { makeStyles } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
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
import SignUpLink, { hasSignUpLink } from "./components/SignUpLink";
import StaleDataIndicator from "./components/StaleDataIndicator";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";

// any location with data older than this will not be displayed at all
export const tooStaleMinutes = 60; // unit in minutes

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
                    "Something went wrong, please try again later."
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

            {errorMessage && <ErrorMessageAlert message={errorMessage} />}

            {!errorMessage && (
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
                        <NoAppointmentsAlert />
                    )}
                    <div role="list">
                        {formattedData.map((entry) => (
                            <LocationCard
                                entry={entry}
                                className={classes.cardBox}
                                onlyShowAvailable={onlyShowAvailable}
                                key={`${entry.location}-${entry.streetAddress}-${entry.city}`}
                            />
                        ))}
                    </div>
                </section>
            )}
        </>
    );
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
                    Important Eligibility Notice
                </Typography>
            </HelpDialog>
        );
    }
}

function LocationCard({ entry, className, onlyShowAvailable }) {
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

function ErrorMessageAlert({ message }) {
    //const classes = useStyles();
    return (
        <>
            <Alert severity={"error"}>
                <AlertTitle>Unexpected Internal Error</AlertTitle>
                <p>{message}</p>
            </Alert>
            <br />
        </>
    );
}
