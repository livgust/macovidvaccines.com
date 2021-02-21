import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useState } from "react";
import HelpDialog from "./HelpDialog";

const useStyles = makeStyles((theme) => ({
    dateSelectDropdown: {
        marginRight: theme.spacing(2),
    },
}));

export function hasSignUpLink(entry) {
    if (entry.hasAppointments) {
        if (entry.signUpLink) {
            // one sign-up link for all availabilities
            return true;
        } else {
            for (const date in entry.appointmentData) {
                if (
                    entry.appointmentData[date].hasAvailability &&
                    entry.appointmentData[date].signUpLink
                ) {
                    // at least one sign-up link found, we're done.
                    return true;
                }
            }
        }
    }
    return false;
}

export default function SignUpLink({ entry }) {
    if (entry.hasAppointments) {
        if (entry.signUpLink) {
            // one sign-up link for all availabilities
            return (
                <Button
                    variant="contained"
                    color="secondary"
                    href={entry.signUpLink}
                    rel="noreferrer"
                    target="_blank"
                >
                    Sign Up
                </Button>
            );
        } else {
            let dateLinkPairs = [];
            for (const date in entry.appointmentData) {
                if (
                    entry.appointmentData[date].hasAvailability &&
                    entry.appointmentData[date].signUpLink
                ) {
                    dateLinkPairs.push([
                        date,
                        entry.appointmentData[date].signUpLink,
                    ]);
                }
            }
            if (!dateLinkPairs.length) {
                return (
                    <div>
                        No sign-up link available.
                        <HelpDialog
                            title="No sign-up link available."
                            text="We were unable to retrieve a sign-up link for this location. It's likely that this location is pulling from a wait list and is not scheduling any new appointments."
                        />
                    </div>
                );
            } else if (dateLinkPairs.length === 1) {
                return (
                    <Button
                        variant="contained"
                        color="secondary"
                        href={dateLinkPairs[0][1]}
                        rel="noreferrer"
                        target="_blank"
                    >
                        Sign Up
                    </Button>
                );
            } else {
                return <DropDownWithButton dateLinkPairs={dateLinkPairs} />;
            }
        }
    } else {
        return <div></div>;
    }
}

function DropDownWithButton({ dateLinkPairs }) {
    const [dateIndexSelected, setDateIndexSelected] = useState(0);
    const classes = useStyles();
    return (
        <>
            <Select
                value={dateIndexSelected}
                onChange={(event) => setDateIndexSelected(event.target.value)}
                className={classes.dateSelectDropdown}
            >
                {dateLinkPairs.map((pair, index) => (
                    <MenuItem key={pair[0]} value={index}>
                        {pair[0]}
                    </MenuItem>
                ))}
            </Select>
            <Button
                variant="contained"
                color="secondary"
                href={dateLinkPairs[dateIndexSelected][1]}
                rel="noreferrer"
                target="_blank"
            >
                Sign Up
            </Button>
        </>
    );
}
