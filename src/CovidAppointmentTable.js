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
import { useTranslation, Trans } from "react-i18next";

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
    pharmacySignUp: {
        marginTop: theme.spacing(0.5),
    },
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
                <PharmacyChainCard className={classes.cardBox} />
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
    const { t } = useTranslation("main");
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
                    {t("restriction.title")}
                </Typography>
            </HelpDialog>
        );
    }
}

function LocationCard({ entry, className, onlyShowAvailable, showMiles }) {
    const { t } = useTranslation("main");
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
                                    t("location.miles", { count: entry.miles })}
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
function PharmacySignUp({ href, name }) {
    const { t } = useTranslation("main");
    const classes = useStyles();
    return (
        <div className={classes.pharmacySignUp}>
            <a href={href} target="_blank" rel="noreferrer">
                {t(name)}
            </a>
        </div>
    );
}

function PharmacyChainCard({ className }) {
    const { t } = useTranslation("main");
    const classes = useStyles();
    return (
        <div role="listitem" className={className}>
            <Card>
                <CardHeader
                    title={
                        <div className={classes.locationTitle}>
                            <span>{t("pharmacy.title")}</span>
                        </div>
                    }
                />
                <CardContent>
                    {t("pharmacy.availability")}
                    <br />

                    <PharmacySignUp
                        href="https://www.cvs.com/immunizations/covid-19-vaccine?icid=cvs-home-hero1-banner-1-link2-coronavirus-vaccine"
                        name={t("pharmacy.cvs")}
                    />
                    <PharmacySignUp
                        href="https://stopandshopsched.rxtouch.com/rbssched/program/covid19/Patient/Advisory"
                        name={t("pharmacy.stop_and_shop")}
                    />
                    <PharmacySignUp
                        href="https://www.walgreens.com/findcare/vaccination/covid-19/location-screening"
                        name={t("pharmacy.walgreens")}
                    />
                    <PharmacySignUp
                        href="https://www.walmart.com/cp/immunizations-flu-shots/1228302"
                        name={t("pharmacy.walmart")}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

function NoAppointmentsAlert() {
    const { t } = useTranslation("main");
    return (
        <div role="status">
            <br />
            <Alert severity={"info"}>
                <AlertTitle>{t("no_appointments.title")}</AlertTitle>
                <p>
                    <Trans t={t} i18nKey="no_appointments.paragraph1">
                        None of the vaccine sites that we monitor currently have
                        available appointments. This website gathers data every
                        minute from COVID-19 vaccine sites across Massachusetts.
                    </Trans>
                </p>
                <p>
                    <Trans t={t} i18nKey="no_appointments.paragraph2">
                        Check back for updated information. For more information
                        on the vaccine rollout in Massachusetts, visit{" "}
                        <a
                            href="https://www.mass.gov/covid-19-vaccine"
                            target="_blank"
                            rel="noreferrer"
                        >
                            www.mass.gov/covid-19-vaccine
                        </a>
                        .
                    </Trans>
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
                    <Trans ns="main" i18nKey="no_appointments_within.title">
                        No Appointments Found Within {{ miles }} Miles
                    </Trans>
                </AlertTitle>
                <p>
                    <Trans ns="main" i18nKey="no_appointments_within.content">
                        The following locations have appointments, but they are
                        farther than the {{ miles }} mile limit you specified.
                        This website gathers data every minute from COVID-19
                        vaccine sites across Massachusetts.
                    </Trans>
                </p>
            </Alert>
            <br />
        </div>
    );
}
