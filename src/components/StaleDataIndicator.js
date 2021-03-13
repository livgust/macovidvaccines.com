import { makeStyles } from "@material-ui/core";
import HistoryOutlinedIcon from "@material-ui/icons/HistoryOutlined";
import React from "react";

// any location with data older than this will be labeled as "stale"
export const staleMinutesDefault = 8; // unit is Minutes

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
    const now = new Date();

    let staleMinutes = staleMinutesDefault;
    if (staleMinutesOverride || staleMinutesOverride === 0) {
        staleMinutes = staleMinutesOverride;
    }

    if (!timestamp || timestamp >= now - staleMinutes * 60 * 1000) {
        return null;
    } else {
        let message = "";
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        // timestamp is today
        const timestampDate = new Date(timestamp);
        if (timestamp >= now.setHours(0, 0, 0, 0)) {
            // 12:30:31 PM, for example
            let timeString = timestampDate.toLocaleTimeString("en-US");
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
                timestampDate.getMonth() + 1
            }/${timestampDate.getDate()}`;
        }

        return (
            <div className={classes.staleIndicator}>
                <HistoryOutlinedIcon
                    fontSize="small"
                    className={classes.staleIcon}
                />
                {message}
            </div>
        );
    }
}
