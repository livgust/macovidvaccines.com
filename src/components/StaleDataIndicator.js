import { makeStyles } from "@material-ui/core";
import HistoryOutlinedIcon from "@material-ui/icons/HistoryOutlined";

export const staleMinutesDefault = 8;

const useStyles = makeStyles((theme) => ({
    staleIndicator: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        color: theme.palette.warning.dark,
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
        const minutesBeforeNow = parseInt(
            (new Date() - timestamp) / (1000 * 60)
        );
        if (minutesBeforeNow < 60) {
            message = `${minutesBeforeNow} minute${
                minutesBeforeNow > 1 ? "s" : ""
            }`;
        } else if (minutesBeforeNow < 60 * 24) {
            const hoursBeforeNow = parseInt(minutesBeforeNow / 60);
            message = `${hoursBeforeNow} hour${hoursBeforeNow > 1 ? "s" : ""}`;
        } else {
            const daysBeforeNow = parseInt(minutesBeforeNow / (60 * 24));
            message = `${daysBeforeNow} day${daysBeforeNow > 1 ? "s" : ""}`;
        }

        return (
            <div className={classes.staleIndicator}>
                <HistoryOutlinedIcon />
                {message} ago
            </div>
        );
    }
}
