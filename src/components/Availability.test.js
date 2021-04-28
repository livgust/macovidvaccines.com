import { act, render, screen } from "@testing-library/react";

import Availability from "./Availability";

it("does not show dates and slot numbers if there aren't any appointments (onlyShowAvailable)", async () => {
    await act(async () => {
        render(
            <Availability
                onlyShowAvailable={true}
                entry={{
                    hasAppointments: false,
                    signUpLink: "",
                    appointmentData: {},
                }}
            />
        );
    });
    expect(screen.getByTestId("no-availability")).toBeTruthy();
});

// Test 2
it("does not show dates and slot numbers if there aren't any appointments (!onlyShowAvailable)", async () => {
    await act(async () => {
        render(
            <Availability
                onlyShowAvailable={false}
                entry={{
                    hasAppointments: false,
                    signUpLink: "",
                    appointmentData: {},
                }}
            />
        );
    });
    expect(screen.getByTestId("no-availability")).toBeTruthy();
});

it("shows total slots if slots by date aren't available", async () => {
    await act(async () => {
        render(
            <Availability
                entry={{
                    hasAppointments: true,
                    totalAvailability: 13,
                }}
            />
        );
    });
    expect(screen.queryByText("Total available: 13 slots")).toBeTruthy();
});

it("shows total slots if availability has no content", async () => {
    await act(async () => {
        render(
            <Availability
                entry={{
                    hasAppointments: true,
                    totalAvailability: 14,
                    availability: {},
                }}
            />
        );
    });
    expect(screen.queryByText("Total available: 14 slots")).toBeTruthy();
});

it("shows dates and slot numbers when showing all (!onlyShowAvailable)", async () => {
    await act(async () => {
        render(
            <Availability
                onlyShowAvailable={false}
                entry={{
                    hasAppointments: true,
                    appointmentData: {
                        "2021-03-04T00:00:00-05:00": {
                            hasAvailability: false,
                            numberAvailableAppointments: 0,
                        },
                        "2021-03-05T00:00:00-05:00": {
                            hasAvailability: true,
                            numberAvailableAppointments: 271,
                        },
                        "2021-03-06T00:00:00-05:00": {
                            hasAvailability: true,
                            numberAvailableAppointments: 272,
                            signUpLink: "https://macovidvaccines.com",
                        },
                    },
                }}
            />
        );
    });
    expect(screen.queryByText("3/4/21: 0 slots")).toBeFalsy();
    expect(screen.queryByText("3/5/21: 271 slots")).toBeTruthy();
    expect(screen.queryByText("3/6/21: 272 slots")).toBeTruthy();
});

it("shows dates and slot numbers with single sign up link (when onlyShowAvailable)", async () => {
    await act(async () => {
        render(
            <Availability
                onlyShowAvailable={true}
                entry={{
                    hasAppointments: true,
                    signUpLink: "https://macovidvaccines.com",
                    appointmentData: {
                        "2021-03-04T00:00:00-05:00": {
                            hasAvailability: false,
                            numberAvailableAppointments: 0,
                        },
                        "2021-03-05T00:00:00-05:00": {
                            hasAvailability: true,
                            numberAvailableAppointments: 281,
                        },
                        "2021-03-06T00:00:00-05:00": {
                            hasAvailability: true,
                            numberAvailableAppointments: 282,
                        },
                    },
                }}
            />
        );
    });
    expect(screen.queryByText("3/4/21: 0 slots")).toBeFalsy();
    expect(screen.queryByText("3/5/21: 281 slots")).toBeTruthy();
    expect(screen.queryByText("3/6/21: 282 slots")).toBeTruthy();
});

it("shows dates and slot numbers with date sign up link (when onlyShowAvailable)", async () => {
    await act(async () => {
        render(
            <Availability
                onlyShowAvailable={true}
                entry={{
                    hasAppointments: true,
                    // no single signUpLink
                    appointmentData: {
                        "3/4/21": {
                            hasAvailability: false,
                            numberAvailableAppointments: 0,
                        },
                        "3/5/21": {
                            hasAvailability: true,
                            numberAvailableAppointments: 291,
                            // no signUpLink -- so should not be in output
                        },
                        "3/6/21": {
                            hasAvailability: true,
                            numberAvailableAppointments: 292,
                            signUpLink: "https://macovidvaccines.com",
                        },
                    },
                }}
            />
        );
    });
    expect(screen.queryByText("3/4/21: 0 slots")).toBeFalsy();
    expect(screen.queryByText("3/5/21: 291 slots")).toBeFalsy();
    expect(screen.queryByText("3/6/21: 292 slots")).toBeTruthy();
});

it("shows 'Appointments are available, but...' if there aren't any sign up links", async () => {
    await act(async () => {
        render(
            <Availability
                onlyShowAvailable={true}
                entry={{
                    hasAppointments: true,
                    // no single signUpLink
                    appointmentData: {
                        "2021-03-04T00:00:00-05:00": {
                            hasAvailability: false,
                            numberAvailableAppointments: 0,
                        },
                        "2021-03-05T00:00:00-05:00": {
                            hasAvailability: true,
                            numberAvailableAppointments: 291,
                            // no signUpLink -- so should not be in output
                        },
                        "2021-03-06T00:00:00-05:00": {
                            hasAvailability: true,
                            numberAvailableAppointments: 292,
                            // no signUpLink -- so should not be in output
                        },
                    },
                }}
            />
        );
    });
    expect(screen.getByTestId("appts-available")).toBeTruthy();
});

it("shows dates and slot numbers even without signUpLink (when !onlyShowAvailable)", async () => {
    await act(async () => {
        render(
            <Availability
                onlyShowAvailable={false}
                entry={{
                    hasAppointments: true,
                    // no single signUpLink
                    appointmentData: {
                        "2021-03-04T00:00:00-05:00": {
                            hasAvailability: false,
                            numberAvailableAppointments: 0,
                        },
                        "2021-03-05T00:00:00-05:00": {
                            hasAvailability: true,
                            numberAvailableAppointments: 291,
                            // no signUpLink
                        },
                        "2021-03-06T00:00:00-05:00": {
                            hasAvailability: true,
                            numberAvailableAppointments: 292,
                            // no signUpLink
                        },
                    },
                }}
            />
        );
    });
    expect(screen.queryByText("3/4/21: 0 slots")).toBeFalsy();
    expect(screen.queryByText("3/5/21: 291 slots")).toBeTruthy();
    expect(screen.queryByText("3/6/21: 292 slots")).toBeTruthy();
});

it("shows 'Appointments are available, but...' message if there is no appointment dates", async () => {
    await act(async () => {
        render(
            <Availability
                onlyShowAvailable={true}
                entry={{
                    hasAppointments: true,
                    signUpLink: "https://macovidvaccines.com",
                    appointmentData: {},
                }}
            />
        );
    });
    expect(screen.getByTestId("appts-available")).toBeTruthy();
});

it("shows total slots across all available days", async () => {
    await act(async () => {
        render(
            <Availability
                entry={{
                    hasAppointments: true,
                    appointmentData: {
                        "2021-10-11T00:00:00-05:00": {
                            hasAvailability: true,
                            numberAvailableAppointments: 34,
                        },
                        "2021-10-12T00:00:00-05:00": {
                            hasAvailability: true,
                            numberAvailableAppointments: 36,
                        },
                    },
                }}
            />
        );
    });
    expect(screen.getByTestId("total-available")).toBeTruthy();
    expect(screen.getByText("Total available: 70 slots")).toBeVisible();
});

it("does not show total slots across all available days if there aren't any", async () => {
    await act(async () => {
        render(
            <Availability
                entry={{
                    hasAppointments: false,
                    totalAvailability: 0,
                }}
            />
        );
    });
    expect(() => {
        screen.getByTestId("total-available");
    }).toThrow();
});
