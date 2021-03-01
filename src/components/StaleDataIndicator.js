import { makeStyles } from "@material-ui/core";
import HistoryOutlinedIcon from "@material-ui/icons/HistoryOutlined";

export const staleMinutesDefault = 8;

const useStyles = makeStyles((theme) => ({
    staleIndicator: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        color: theme.palette.text.primary,
    },
    staleIcon: {
        color: theme.palette.warning.dark,
        "padding-right": theme.spacing(1),
    },
}));

export default function StaleDataIndicator({
    timestamp,
    staleMinutesOverride,
}) {
    const classes = useStyles();

    let staleMinutes = staleMinutesDefault;
    if (staleMinutesOverride || staleMinutesOverride === 0) {
        staleMinutes = staleMinutesOverride;
    }

    if (!timestamp || timestamp >= new Date() - staleMinutes * 60 * 1000) {
        return null;
    } else {
        let message = "";
        let yesterday = new Date();
        yesterday.setDate(new Date().getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        // timestamp is today
        if (timestamp >= new Date().setHours(0, 0, 0, 0)) {
            // 12:30:31 PM, for example
            let timeString = new Date(timestamp).toLocaleTimeString("en-US");
            // chop off the seconds
            timeString = timeString.replace(/:[0-9]{2}\s/, " ");
            message = `Last updated ${timeString}`;
        }
        // timestamp is yesterday
        else if (timestamp >= yesterday) {
            message = "Last updated yesterday";
        }
        // timestamp is older than yesterday
        else {
            message = `Last updated ${
                new Date(timestamp).getMonth() + 1
            }/${new Date(timestamp).getDate()}`;
        }

        return (
            <div className={classes.staleIndicator}>
                <HistoryOutlinedIcon className={classes.staleIcon} />
                {message}
            </div>
        );
    }
}
