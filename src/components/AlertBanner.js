import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

const useStyles = makeStyles((theme) => ({
    alertBanner: {
        marginBottom: theme.spacing(2),
        display: "flex",
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
    /*
    {
        startDate: "2021-03-04T06:00:00-05:00", // current timezone offset is at the end
        endDate: "2021-03-24T09:00:00-05:00",
        severity: "warning", // one of "error", "info", "success", "warning"
        title: "Thursday, March 4",
        contents:
            "Due to high demand, the MA vaccination websites are experiencing technical difficulties. Once the issues are resolved, their locations will appear on this website.",
    },
*/
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
    return timelyAlerts.map((alert) => {
        return (
            <Alert severity={alert.severity} className={classes.alertBanner}>
                <AlertTitle>{alert.title}</AlertTitle>
                {alert.contents}
            </Alert>
        );
    });
}
