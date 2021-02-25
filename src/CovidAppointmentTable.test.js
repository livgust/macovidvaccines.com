import { act, render, screen } from "@testing-library/react";

import CovidAppointmentTable from "./CovidAppointmentTable";

import prodResults from "../test/fixtures/api/prod.json";
import noResults from "../test/fixtures/api/no-data.json";

// actual API returns `body` as a string but we store it as a POJO in the fixture for
// ease of reading
const prodData = {
    ...prodResults,
    body: JSON.stringify(prodResults.body),
};

const noData = {
    ...noResults,
    body: JSON.stringify(noResults.body),
};

beforeAll(function () {
    jest.spyOn(window, "fetch");
});

describe("the CovidAppointmentTable component", function () {
    describe("when api data is available", function () {
        beforeEach(function () {
            window.fetch.mockResolvedValueOnce({
                json: async () => prodData,
                ok: true,
            });
        });

        test("it displays results as a filtered list of appointment cards", async function () {
            await act(async function () {
                render(<CovidAppointmentTable />);
            });

            expect(await screen.findAllByRole("listitem")).toHaveLength(2);
        });

        test("disabling the filter shows all appointment cards", async function () {
            await act(async function () {
                render(<CovidAppointmentTable />);
            });

            (await screen.findByRole("switch")).click();

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
                render(<CovidAppointmentTable />);
            });

            expect(await screen.findByRole("status")).toBeInTheDocument();
        });
    });

    describe("when the api endpoint can not be reached", function () {
        beforeEach(function () {
            window.fetch.mockImplementationOnce(() =>
                Promise.reject(new TypeError("network error"))
            );
        });

        test("it displays an error message", async function () {
            await act(async function () {
                render(<CovidAppointmentTable />);
            });

            expect(
                screen.getByText(
                    "Something went wrong, please try again later."
                )
            ).toBeInTheDocument();

            expect(await screen.findByRole("alert")).toBeInTheDocument();
        });
    });
});
