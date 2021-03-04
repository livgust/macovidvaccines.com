import HelpDialog from "./HelpDialog";

export default function Availability({ entry, onlyShowAvailable }) {
    if (!entry.hasAppointments) {
        return <div>No availability.</div>;
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
