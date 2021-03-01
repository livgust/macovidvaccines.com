import { act, render, screen } from "@testing-library/react";

import StaleDataIndicator from "./StaleDataIndicator";

it("shows no indicator if the data is less than 10 minutes old", async () => {
    const recentTimestamp = new Date() - 9 * 60 * 1000; //9 mins old
    await act(async () => {
        render(
            <StaleDataIndicator
                timestamp={recentTimestamp}
                staleMinutesOverride={10}
            />
        );
    });
    expect(screen.queryByText("ago")).toBeNull();
});

describe("staleness messaging", () => {
    it.skip("shows time if it's today", async () => {
        const minutesStaleTimestamp = new Date().setHours(12, 0, 0, 0); // 35 mins stale
        await act(async () => {
            render(
                <StaleDataIndicator
                    timestamp={minutesStaleTimestamp}
                    staleMinutesOverride={10}
                />
            );
        });

        expect(screen.getByText("Last updated 12:00 PM")).toBeTruthy();
    });

    it("shows 'yesterday' if it was yesterday", async () => {
        // 24 hrs ago
        const minutesStaleTimestamp = new Date() - 24 * 60 * 60 * 1000;
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
        const minutesStaleTimestamp = new Date("2021-01-21T00:00");
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
