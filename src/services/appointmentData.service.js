import { isAvailable } from "../components/FilterPanel/AvailabilityFilter";
import { isWithinRadius } from "../components/FilterPanel/RadiusFilter";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

// This is the timestamp of our data. It should be used instead of "new Date()"
export let dataNow = dayjs();

// any location with data older than this will not be displayed at all
const tooStaleMinutes = 60; // unit in minutes

function transformData(data) {
    const ourDateFormat = "M/D/YY"; // 3/2
    // future format?    "ddd, MMM D"; // Tue Mar 2

    let mappedData = data.map((entry, index) => {
        let availability = [];
        if (entry.availability) {
            for (const [key, value] of Object.entries(entry.availability)) {
                let newKey = dayjs(key).format(ourDateFormat);
                availability[newKey] = value;
            }
        }

        return {
            key: index,
            location: entry.name,
            streetAddress: entry.street,
            city: entry.city,
            zip: entry.zip,
            hasAppointments: entry.hasAvailability,
            appointmentData: availability || null,
            signUpLink: entry.signUpLink || null,
            extraData: entry.extraData || null,
            restrictions: entry.restrictions || null,
            coordinates: {
                latitude: entry.latitude,
                longitude: entry.longitude,
            },
            timestamp: entry.timestamp ? new Date(entry.timestamp) : null,
        };
    });

    // Pre-Filter the locations that have "non-stale" data
    const oldestGoodTimestamp = dataNow - tooStaleMinutes * 60 * 1000;
    return mappedData.filter((d) => {
        return !d.timestamp || d.timestamp >= oldestGoodTimestamp;
    });
}

export function sortData(data, sortKey) {
    return data.sort((a, b) => {
        const first = a[sortKey];
        const second = b[sortKey];
        if (typeof first == "string") {
            return first.localeCompare(second);
        } else {
            return first - second;
        }
    });
}

export function filterData(data, { filterByAvailable, filterByZipCode }) {
    return data.filter((d) => {
        if (filterByAvailable && !isAvailable(d)) {
            return false;
        }
        return !(
            filterByZipCode.zipCode &&
            !isWithinRadius(d, filterByZipCode.zipCode, filterByZipCode.miles)
        );
    });
}

export function getAppointmentData() {
    let testDataTransformed = null;

    if (
        process.env.NODE_ENV !== "production" &&
        !process.env.REACT_APP_IGNORE_DEVTEST_JSON
    ) {
        // This is a testing branch to get data from a local file instead of the production file.
        // It will read a file called "test/devtest.json" in the src directory.
        // You can obtain a cached file using a cmd line:
        //
        // aws s3 cp s3://ma-covid-vaccine/data-2021-02-23T2253Z.json src/test/devtest.json

        try {
            let testData = require("../test/devtest.json");

            // If it has 'body', then this looks like something pasted from a browser (View Source)
            if (testData.hasOwnProperty("body")) {
                if (typeof testData.body == "object") {
                    testData = testData.body;
                } else {
                    testData = JSON.parse(testData.body);
                }
            }

            if (testData.results) {
                if (testData.timestamp) {
                    dataNow = dayjs.utc(
                        testData.timestamp,
                        "YYYY-MM-DDTHHmmss[Z]"
                    );
                } else {
                    // If there is no timestamp in the test data
                    // then just use a date in the past so that nothing is filtered
                    dataNow = dayjs("03/11/2020");
                }
                testDataTransformed = transformData(testData.results);
            }
        } catch (err) {
            // if the file doesn't exist, just get the prod file
            testDataTransformed = null;
        }
    }

    if (testDataTransformed) {
        return Promise.resolve(testDataTransformed);
    } else {
        dataNow = dayjs();
        return fetch(
            "https://mzqsa4noec.execute-api.us-east-1.amazonaws.com/prod"
        ).then(async (res) => {
            return transformData(JSON.parse((await res.json()).body).results);
        });
    }
}
