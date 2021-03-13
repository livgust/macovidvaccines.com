import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Button from "@material-ui/core/Button";
import React from "react";

const useStyles = makeStyles((theme) => ({
    alertBanner: {
        marginBottom: theme.spacing(2),
        display: "flex",
    },
    alertButton: {
        color: theme.palette.primary,
    },
}));

/* There are four severity levels each has its own icon built-in
 *  error   - red
 *  warning - orange (** this is what you should probably use)
 *  info    - blue
 *  success - green
 */
/* The "-05:00" at the end of the dates adjust from EST to UTC
 * NOTE: DST begins on 3/14/2021 when the offset becomes "-04:00"
 * NOTE: EST begins on 11/7/2021 when the offset becomes "-05:00"
 */
const alerts = [
    {
        startDate: "2021-03-12T06:00:00-05:00", // current timezone offset is at the end
        endDate: "2021-03-19T09:00:00-05:00",
        severity: "success", // one of "error", "info", "success", "warning"
        title: "Preregister for Mass Vaccination Site",
        contents: (
            <>
                <p>
                    The Commonwealth’s{" "}
                    <a href="https://www.mass.gov/info-details/preregister-for-a-covid-19-vaccine-appointment">
                        preregistration system
                    </a>{" "}
                    helps you get an appointment at one of the seven mass
                    vaccination locations. You’ll receive weekly status updates,
                    and you may opt out at any time if you find an appointment
                    elsewhere.
                </p>
                <p>
                    We recommend preregistering <i>and</i> using this site
                    &mdash; you may find an appointment at locations not covered
                    by preregistration.
                </p>
            </>
        ),
        button: "Preregister now",
        buttonLink:
            "https://www.mass.gov/info-details/preregister-for-a-covid-19-vaccine-appointment",
    },
];

export default function AlertBanner() {
    const classes = useStyles();

    // No alerts? Then we're done!
    if (!alerts.length) {
        return false;
    }

    // Filter all of the timely alerts
    const now = new Date();
    const timelyAlerts = alerts.filter((alert) => {
        return (
            new Date(alert.startDate) <= now && now < new Date(alert.endDate)
        );
    });

    // Output an Alert for each of the remaining timely alerts
    return timelyAlerts.map((alert, index) => {
        return (
            <Alert
                severity={alert.severity}
                key={index}
                className={classes.alertBanner}
            >
                <AlertTitle>{alert.title}</AlertTitle>
                {alert.contents}
                {alert.button ? (
                    <p>
                        <Button
                            variant="contained"
                            className={classes.resourceButton}
                            href={alert.buttonLink}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {alert.button}
                        </Button>
                    </p>
                ) : null}
            </Alert>
        );
    });
}
