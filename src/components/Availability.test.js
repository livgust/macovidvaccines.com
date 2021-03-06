import { act, render, screen } from "@testing-library/react";

import Availability from "./Availability";

it("shows dates and slot numbers", async () => {
    await act(async () => {
        render(
            <Availability
                entry={{
                    hasAppointments: true,
                    appointmentData: {
                        "Mon Oct 11": {
                            hasAvailability: true,
                            numberAvailableAppointments: 35,
                        },
                    },
                }}
            />
        );
    });
    expect(screen.queryByText("Mon Oct 11: 35 slots")).toBeTruthy();
});

// {TODO}
it.skip("shows total slots if slots by date aren't available", async () => {
    await act(async () => {
        render(
            <Availability
                entry={{
                    hasAppointments: true,
                    totalAvailability: 45,
                }}
            />
        );
    });
    expect(screen.queryByText("45 slots")).toBeTruthy();
});

// {TODO}
it.skip("shows total slots if availability has no content", async () => {
    await act(async () => {
        render(
            <Availability
                entry={{
                    hasAppointments: true,
                    totalAvailability: 45,
                    availability: {},
                }}
            />
        );
    });
    expect(screen.queryByText("45 slots")).toBeTruthy();
});
