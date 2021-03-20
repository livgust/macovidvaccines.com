import { act, render, screen } from "@testing-library/react";

import MoreInformation from "./MoreInformation";

it("doesn't show if no extra info", async () => {
    await act(async () => {
        render(<MoreInformation entry={{}} />);
    });
    expect(screen.queryByText("More Information")).toBeNull();
});

it("doesn't show if ONLY an address", async () => {
    await act(async () => {
        render(<MoreInformation entry={{ streetAddress: "123 Easy St" }} />);
    });
    expect(screen.queryByText("More Information")).toBeFalsy();
});

it("show if an address AND restrictions", async () => {
    await act(async () => {
        render(
            <MoreInformation
                entry={{
                    streetAddress: "123 Easy St",
                    restrictions: "Cool cats and kittens only",
                }}
            />
        );
    });
    expect(screen.queryByText("More Information")).toBeTruthy();
});

it("shows if restrictions", async () => {
    await act(async () => {
        render(
            <MoreInformation
                entry={{ restrictions: "Cool cats and kittens only" }}
            />
        );
    });
    expect(screen.queryByText("More Information")).toBeTruthy();
});

it("shows if extra data", async () => {
    await act(async () => {
        render(
            <MoreInformation
                entry={{ extraData: { exampleKey: "exampleValue" } }}
            />
        );
    });
    expect(screen.queryByText("More Information")).toBeTruthy();
});

it("doesn't have address line if no address", async () => {
    await act(async () => {
        render(
            <MoreInformation
                entry={{ extraData: { exampleKey: "exampleValue" } }}
            />
        );
    });
    expect(screen.queryByText("Address:")).toBeNull();
});
