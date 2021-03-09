import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AvailabilityFilter from "./AvailabilityFilter";

it("shows label", async () => {
    await act(async () => {
        render(<AvailabilityFilter />);
    });
    expect(screen.getByText("Has Available Appointments")).toBeTruthy();
});

it("is checked", async () => {
    await act(async () => {
        render(<AvailabilityFilter onlyShowAvailable />);
    });
    expect(screen.getByTestId("availability-checkbox")).toHaveProperty(
        "checked",
        true
    );
});

it("is not checked", async () => {
    await act(async () => {
        render(<AvailabilityFilter />);
    });
    expect(screen.getByTestId("availability-checkbox")).toHaveProperty(
        "checked",
        false
    );
});

it("executes onChange with true when clicked from empty", async () => {
    const onChange = jest.fn();
    await act(async () => {
        render(<AvailabilityFilter onChange={onChange} />);
    });
    userEvent.click(screen.getByTestId("availability-checkbox"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(true);
});

it("executes onChange with false when clicked from checked", async () => {
    const onChange = jest.fn();
    await act(async () => {
        render(<AvailabilityFilter onChange={onChange} onlyShowAvailable />);
    });
    userEvent.click(screen.getByTestId("availability-checkbox"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(false);
});
