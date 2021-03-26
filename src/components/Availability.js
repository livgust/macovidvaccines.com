import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
    totalSlotsSummary: {
        fontWeight: "bold",
    },
    availability: {
        marginBottom: theme.spacing(2),
    },
}));

export default function Availability({ entry, onlyShowAvailable }) {
    const classes = useStyles();
    const { t } = useTranslation("main");
    if (entry.isMassVax) {
        return (
            <div>
                Appointments at this site are by{" "}
                <Link
                    href="https://vaccineSignUp.mass.gov"
                    rel="noreferrer"
                    target="_blank"
                >
                    preregistration only.
                </Link>{" "}
                Once you register, the Commonwealth will notify you when an
                appointment is available.
            </div>
        );
    }
    if (!entry.hasAppointments) {
        return (
            <div className={classes.availability} data-testid="no-availability">
                No availability.
            </div>
        );
    } else if (
        entry.totalAvailability &&
        (!entry.availability || !Object.keys(entry.availability).length)
    ) {
        return (
            <div>
                {`${entry.totalAvailability} ${
                    entry.totalAvailability === 1 ? "slot" : "slots"
                }`}
            </div>
        );
    } else {
        const availableSlots = [];
        const singleSignupLink = !!entry.signUpLink;
        for (const date in entry.appointmentData) {
            // Show dates that have availability AND one of these three conditions:
            // (1) We are showing all appointments; OR
            // (2) The site has a single signup link; OR
            // (3) This date has it's own signup link
            if (
                entry.appointmentData[date].hasAvailability &&
                (!onlyShowAvailable ||
                    singleSignupLink ||
                    entry.appointmentData[date].signUpLink)
            ) {
                availableSlots.push({
                    date: date,
                    ...entry.appointmentData[date],
                });
            }
        }
        if (!availableSlots.length) {
            return (
                <div
                    className={classes.availability}
                    data-testid="appts-available"
                >
                    Appointments are available, but this location isn't
                    providing details. Click{" "}
                    <Link
                        href={entry.signUpLink ? entry.signUpLink : ""}
                        rel="noreferrer"
                        target="_blank"
                    >
                        sign up
                    </Link>{" "}
                    to look on their website.
                </div>
            );
        } else {
            const totalAvailableSlots = availableSlots.reduce(
                (total, slot) => total + slot.numberAvailableAppointments,
                0
            );
            return (
                <div className={classes.availability}>
                    {totalAvailableSlots > 1 && availableSlots.length > 1 && (
                        <div
                            className={classes.totalSlotsSummary}
                            data-testid="total-available"
                        >
                            {`Total available: ${totalAvailableSlots} slots`}
                        </div>
                    )}
                    {availableSlots.map((slot) => (
                        <div key={slot.date}>
                            {`${slot.date}: ${t("availability.slot", {
                                count: slot.numberAvailableAppointments,
                            })}`}
                        </div>
                    ))}
                </div>
            );
        }
    }
}
