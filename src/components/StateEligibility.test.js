import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import StateEligibility from "./StateEligibility";

describe("<StateEligibility />", function () {
    test("it correctly renders a button", () => {
        const { getByTestId } = render(<StateEligibility />);
        expect(getByTestId("eligibility-button")).toBeVisible();
    });

    test("it correctly opens a modal after clicking the button", async function () {
        const { getByTestId } = render(<StateEligibility />);
        const button = getByTestId("eligibility-button");
        fireEvent.click(button);

        await waitFor(() => screen.getByTestId("eligibility-modal"));

        const modal = screen.getByTestId("eligibility-modal");
        expect(modal).toBeVisible();

        await waitFor(() => screen.getByTestId("eligibility-iframe"));
        expect(screen.getByTestId("eligibility-iframe")).toBeVisible();
    });
});
