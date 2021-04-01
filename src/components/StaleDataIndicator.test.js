import { act, render, screen } from "@testing-library/react";

import StaleDataIndicator from "./StaleDataIndicator";
import { dataNow } from "../services/appointmentData.service";

it("shows no indicator if the data is less than 60 minutes old", async () => {
    const recentTimestamp = new Date(dataNow) - 60 * 1000; // 1 min old
    await act(async () => {
        render(
            <StaleDataIndicator
                timestamp={recentTimestamp}
                staleMinutesOverride={60}
            />
        );
    });
    expect(screen.queryByText("ago")).toBeNull();
});

describe("staleness messaging", () => {
    it("shows time if it's today", async () => {
        // Use the smallest possible difference in time, to avoid failing tests
        // when run near the boundary of two days in real time.
        const minutesStaleTimestamp = new Date(dataNow) - 1; // 1 millisecond old
        await act(async () => {
            render(
                <StaleDataIndicator
                    timestamp={minutesStaleTimestamp}
                    staleMinutesOverride={0}
                />
            );
        });

        const timestampDate = new Date(minutesStaleTimestamp);
        function padMinutes(minutes) {
            return minutes < 10 ? `0${minutes}` : minutes;
        }
        // We need 1 PM - 12 PM, not 0 PM - 11 PM, so plus-11-mod-12-plus-1:
        const hours = ((timestampDate.getHours() + 11) % 12) + 1;
        const minutes = padMinutes(timestampDate.getMinutes());
        const AMPM = timestampDate.getHours() >= 12 ? "PM" : "AM";
        expect(
            screen.getByText(`Last updated ${hours}:${minutes} ${AMPM}`)
        ).toBeTruthy();
    });

    it("shows 'yesterday' if it was yesterday", async () => {
        // 24 hrs ago
        const minutesStaleTimestamp = new Date(dataNow) - 24 * 60 * 60 * 1000;
        await act(async () => {
            render(
                <StaleDataIndicator
                    timestamp={minutesStaleTimestamp}
                    staleMinutesOverride={10}
                />
            );
        });

        expect(screen.getByText("Last updated yesterday")).toBeTruthy();
    });

    it("shows date if older than yesterday", async () => {
        const minutesStaleTimestamp = new Date("2007-01-21T00:00");
        await act(async () => {
            render(
                <StaleDataIndicator
                    timestamp={minutesStaleTimestamp}
                    staleMinutesOverride={10}
                />
            );
        });

        expect(screen.getByText("Last updated 1/21")).toBeTruthy();
    });
});
