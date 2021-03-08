import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ZipCodeFilter from "./ZipCodeFilter";

it("has passed-in non-empty value", async () => {
    await act(async () => {
        render(<ZipCodeFilter zipCode="123" />);
    });
    expect(screen.getByTestId("zip-input")).toHaveProperty("value", "123");
});

it("has passed-in empty value", async () => {
    await act(async () => {
        render(<ZipCodeFilter zipCode="" />);
    });
    expect(screen.getByTestId("zip-input")).toHaveProperty("value", "");
});

it("executes onChange with true when clicked from empty", async () => {
    const onChange = jest.fn();
    await act(async () => {
        render(<ZipCodeFilter onChange={onChange} />);
    });
    userEvent.type(screen.getByTestId("zip-input"), "1");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith("1");
});
