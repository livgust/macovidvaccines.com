import { isAvailable } from "../components/FilterPanel/AvailabilityFilter";
import { isWithinRadius } from "../components/FilterPanel/RadiusFilter";

const dayjs = require("dayjs");

// any location with data older than this will not be displayed at all
export let tooStaleMinutes = 60; // unit in minutes

export function transformData(data) {
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
    const oldestGoodTimestamp = new Date() - tooStaleMinutes * 60 * 1000;
    return mappedData.filter((d) => {
        return !d.timestamp || d.timestamp >= oldestGoodTimestamp;
    });
}

export function sortData(data, sortKey) {
    const newData = data.sort((a, b) => {
        const first = a[sortKey];
        const second = b[sortKey];
        if (typeof first == "string") {
            return first.localeCompare(second);
        } else {
            return first - second;
        }
    });
    return newData;
}

export function filterData(data, { filterByAvailable, filterByZipCode }) {
    return data.filter((d) => {
        if (filterByAvailable && !isAvailable(d)) {
            return false;
        }
        if (
            filterByZipCode.zipCode &&
            !isWithinRadius(d, filterByZipCode.zipCode, filterByZipCode.miles)
        ) {
            return false;
        }
        return true;
    });
}

export function getAppointmentData() {
    let cachedTransform = null;

    if (process.env.NODE_ENV === "development") {
        // This is a testing branch to get data from a local file instead of the production file.
        // It will read a file called "test/devtest-temp.json" in the src directory.
        // You can obtain a cached file using a cmd line:
        //
        // aws s3 cp s3://ma-covid-vaccine/data-2021-02-23T2253Z.json src/test/devtest-temp.json

        try {
            const testData = require("../test/devtest.json");

            // If it has 'results' then this looks like a timestamp cached json file from S3
            if (testData.hasOwnProperty("results")) {
                console.log("archived data");
                cachedTransform = transformData(testData.results);
            }
            // If it has 'body', then this looks like something pasted from a browser (View Source)
            else if (testData.hasOwnProperty("body")) {
                console.log("Data: View Source");
                cachedTransform = transformData(testData.body.results);
            }
        } catch (err) {
            // if the file doesn't exist, just get the prod file
            console.log("using production file: err= " + err);
        }

        if (cachedTransform) {
            tooStaleMinutes = 60 * 24 * 365 * 25; // 25 years! otherwise, you might not see anything
        }
    }

    return fetch(
        "https://mzqsa4noec.execute-api.us-east-1.amazonaws.com/prod"
    ).then(async (res) => {
        return cachedTransform
            ? cachedTransform
            : transformData(JSON.parse((await res.json()).body).results);
    });
}
