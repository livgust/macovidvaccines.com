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
    it("shows minutes if between staleMinutes and 60 minutes", async () => {
        const minutesStaleTimestamp = new Date() - 35 * 60 * 1000; // 35 mins stale
        await act(async () => {
            render(
                <StaleDataIndicator
                    timestamp={minutesStaleTimestamp}
                    staleMinutesOverride={10}
                />
            );
        });

        expect(screen.getByText("35 minutes ago")).toBeTruthy();
    });

    it("shows hours if between 1 and 24 hours", async () => {
        const minutesStaleTimestamp = new Date() - 3 * 60 * 60 * 1000;
        await act(async () => {
            render(
                <StaleDataIndicator
                    timestamp={minutesStaleTimestamp}
                    staleMinutesOverride={10}
                />
            );
        });

        expect(screen.getByText("3 hours ago")).toBeTruthy();
    });

    it("shows days if over 24 hours", async () => {
        const minutesStaleTimestamp = new Date() - 3 * 24 * 60 * 60 * 1000;
        await act(async () => {
            render(
                <StaleDataIndicator
                    timestamp={minutesStaleTimestamp}
                    staleMinutesOverride={10}
                />
            );
        });

        expect(screen.getByText("3 days ago")).toBeTruthy();
    });

    it("parses singular correctly", async () => {
        const minutesStaleTimestamp = new Date() - 1 * 60 * 1000;
        await act(async () => {
            render(
                <StaleDataIndicator
                    timestamp={minutesStaleTimestamp}
                    staleMinutesOverride={0}
                />
            );
        });

        expect(screen.getByText("1 minute ago")).toBeTruthy();
    });
});
