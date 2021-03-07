import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

const useStyles = makeStyles((theme) => ({
    alertBanner: {
        marginBottom: theme.spacing(2),
        display: "flex",
    },
}));

const alerts = [
    /*    {
        startDate: "2021-03-04T06:00:00-05:00",
        endDate: "2021-03-04T09:00:00-05:00",
        severity: "warning",
        title: "Thursday, March 4",
        contents:
            "Due to high demand, the MA vaccination websites are experiencing technical difficulties. Once the issues are resolved, their locations will appear on this website.",
    },*/
];

export default function AlertBanner() {
    const classes = useStyles();

    const now = new Date();
    return alerts.map((alert) => {
        return new Date(alert.startDate) <= now &&
            now < new Date(alert.endDate) ? (
            <Alert severity={alert.severity} className={classes.alertBanner}>
                <AlertTitle>{alert.title}</AlertTitle>
                {alert.contents}
            </Alert>
        ) : (
            <></>
        );
    });
}
