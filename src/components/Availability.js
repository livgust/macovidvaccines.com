import HelpDialog from "./HelpDialog";

export default function Availability({ entry }) {
    if (!entry.hasAppointments) {
        return <div>No availability.</div>;
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
            return (
                <div>
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
