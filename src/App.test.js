import { act, render, screen } from "@testing-library/react";

import App from "./App";

import prodExample from "../test/fixtures/api/prod.json";
import noResultsExample from "../test/fixtures/api/no-data.json";

// actual API returns `body` as a string but we store it as a POJO in the fixture for
// ease of reading
const prodData = {
    ...prodExample,
    body: JSON.stringify(prodExample.body),
};

const noData = {
    ...noResultsExample,
    body: JSON.stringify(noResultsExample.body),
};

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

            expect(await screen.findAllByRole("listitem")).toHaveLength(2);
        });

        //TODO: UPDATE
        test.skip("disabling the filter shows all appointment cards", async function () {
            await act(async function () {
                render(<App />);
            });

            (await screen.findByLabelText("switch")).click();

            expect(await screen.findAllByRole("listitem")).toHaveLength(3);
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
