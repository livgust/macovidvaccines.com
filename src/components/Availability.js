import HelpDialog from "./HelpDialog";
import Typography from "@material-ui/core/Typography";

export default function Availability({ entry }) {
    if (!entry.hasAppointments) {
        return <div>No availability.</div>;
    } else if (
        entry.totalAvailability &&
        (!entry.availability || !Object.keys(entry.availability).length)
    ) {
        return (
            <div>
                {entry.totalAvailability} slot
                {entry.totalAvailability > 1 ? "s" : ""}
            </div>
        );
    } else {
        const availableSlots = [];
        for (const date in entry.appointmentData) {
            if (entry.appointmentData[date].hasAvailability) {
                availableSlots.push({
                    date: date,
                    ...entry.appointmentData[date],
                });
            }
        }
        if (!availableSlots.length && entry.hasAppointments) {
            return (
                <div>
                    No date-specific data available.
                    <HelpDialog
                        title="No date-specific data available."
                        text="We were able to determine that there are available appointments,
                        but we can't tell when or how many. Click the sign up button to learn more
                        from the location's website."
                    />
                </div>
            );
        } else {
            const totalAvailableSlots = availableSlots.reduce(
                (total, slot) => total + slot.numberAvailableAppointments,
                0
            );
            return (
                <div>
                    {totalAvailableSlots > 1 && availableSlots.length > 1 && (
                        <Typography variant="h6">
                            {`Total available: ${totalAvailableSlots} slots`}
                        </Typography>
                    )}
                    {availableSlots.map((slot) => (
                        <div key={slot.date}>
                            {`${slot.date}: ${
                                slot.numberAvailableAppointments
                            } slot${
                                slot.numberAvailableAppointments > 1 ? "s" : ""
                            }`}
                        </div>
                    ))}
                </div>
            );
        }
    }
}
