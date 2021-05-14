import { act, render, screen } from "@testing-library/react";

import App from "./App";

import prodExample from "../test/fixtures/api/prod.json";
import noResultsExample from "../test/fixtures/api/no-data.json";

const prodData = prodExample.body;

const noData = noResultsExample.body;

beforeAll(function () {
    jest.spyOn(window, "fetch");
});

describe("the App component", function () {
    describe("when api data is available", function () {
        beforeEach(function () {
            window.fetch.mockResolvedValueOnce({
                json: async () => prodData,
                ok: true,
            });
        });

        test("it displays results as a filtered list of appointment cards", async function () {
            await act(async function () {
                render(<App />);
            });

            expect(await screen.findAllByRole("listitem")).toHaveLength(7);
        });

        test("disabling the filter shows all appointment cards", async function () {
            await act(async function () {
                render(<App />);
            });

            if (screen.queryByText("Filter Locations")) {
                screen.getByText("Filter Locations").click();
            }
            await screen.getByTestId("availability-checkbox").click();
            await screen.getByTestId("apply-filters-button").click();

            expect(await screen.findAllByRole("listitem")).toHaveLength(8);
        });
    });

    describe("when no api data is available", function () {
        beforeEach(function () {
            window.fetch.mockResolvedValueOnce({
                json: async () => noData,
                ok: true,
            });
        });

        test("it displays a no-appointments message", async function () {
            await act(async function () {
                render(<App />);
            });

            expect(await screen.findByRole("status")).toBeInTheDocument();
        });
    });

    describe("when the api endpoint can not be reached", function () {
        beforeEach(function () {
            // Suppress noise from App.js's App().useEffect()'s .catch handler
            console.error = jest.fn();
            console.log = jest.fn();
            window.fetch.mockImplementationOnce(() =>
                Promise.reject(new TypeError("network error"))
            );
        });

        test("it displays an error message", async function () {
            await act(async function () {
                render(<App />);
            });

            expect(screen.getByText("Unexpected Internal Error"));
        });
    });
});
