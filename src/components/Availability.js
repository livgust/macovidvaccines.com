import { makeStyles } from "@material-ui/core/styles";
import { useTranslation, Trans } from "react-i18next";
import Link from "@material-ui/core/Link";
import dayjs from "dayjs";

const availabilityDateFormat = "M/D/YY";

const useStyles = makeStyles((theme) => ({
    totalSlotsSummary: {
        fontWeight: "bold",
    },
    availability: {
        marginBottom: theme.spacing(2),
    },
    today: {
        color: "#006600",
        fontWeight: "bold",
    },
}));

export default function Availability({ entry, onlyShowAvailable }) {
    const classes = useStyles();
    const { t } = useTranslation("main");
    if (entry.isMassVax) {
        return (
            /* NOTE: This section is not actually in use by production at this time */
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
                {t("availability.none")}
            </div>
        );
    } else if (
        entry.totalAvailability &&
        (!entry.availability || !Object.keys(entry.availability).length)
    ) {
        return (
            <div>
                {t("availability.total_slot", {
                    count: entry.totalAvailability,
                })}
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
                    <Trans t={t} i18nKey="availability.no_details">
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
                    </Trans>
                </div>
            );
        } else {
            const totalAvailableSlots = availableSlots.reduce(
                (total, slot) => total + slot.numberAvailableAppointments,
                0
            );
            const todayDate = dayjs().format(availabilityDateFormat);
            return (
                <div className={classes.availability}>
                    {totalAvailableSlots > 1 && availableSlots.length > 1 && (
                        <div
                            className={classes.totalSlotsSummary}
                            data-testid="total-available"
                        >
                            {t("availability.total_slot", {
                                count: totalAvailableSlots,
                            })}
                        </div>
                    )}
                    {availableSlots.map((slot) => {
                        const displayDate = dayjs(slot.date).format(
                            availabilityDateFormat
                        );
                        const isToday = displayDate === todayDate;
                        const displayToday = isToday
                            ? ` ${t("availability.today")}`
                            : "";
                        const displayClass = isToday ? classes.today : "";
                        return (
                            <div key={slot.date} className={displayClass}>
                                {`${displayDate}${displayToday}: ${t(
                                    "availability.slot",
                                    {
                                        count: slot.numberAvailableAppointments,
                                    }
                                )}`}
                            </div>
                        );
                    })}
                </div>
            );
        }
    }
}
