import { isAvailable } from "../components/FilterPanel/AvailabilityFilter";
import { isWithinRadius } from "../components/FilterPanel/RadiusFilter";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { setCookie } from "./cookie.service";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

// This is the timestamp of our data. It should be used instead of "new Date()"
export let dataNow = dayjs();

// any location with data older than this will not be displayed at all
const tooStaleMinutes = 20; // unit in minutes

export function combineMoreInformation(moreInfo) {
    if (hasSameInformationText(moreInfo)) {
        return Object.values(moreInfo)[0];
    } else {
        return Object.keys(moreInfo)
            .map((date) => `${date}: ${moreInfo[date]}`)
            .join("&#10;&#13;");
    }
}

export function hasSameInformationText(moreInfo) {
    return Object.values(moreInfo).reduce(
        (cum, cur, ind, arr) => ind === 0 || (cum && arr[ind - 1] === cur),
        true
    );
}

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

        let extraData = entry.extraData;
        if (extraData && extraData["Additional Information"]) {
            let newMoreInfo = extraData["Additional Information"];
            if (
                entry.hasAvailability &&
                typeof newMoreInfo === "object" &&
                Object.keys(newMoreInfo).length
            ) {
                newMoreInfo = {};
                for (const key of Object.keys(
                    extraData["Additional Information"]
                )) {
                    const formattedKey = dayjs(key).format(ourDateFormat);
                    if (availability[formattedKey].hasAvailability) {
                        newMoreInfo[formattedKey] =
                            extraData["Additional Information"][key];
                    }
                }
            }
            if (typeof newMoreInfo === "object" && Object.keys(newMoreInfo)) {
                newMoreInfo = combineMoreInformation(newMoreInfo);
            }
            extraData["Additional Information"] = newMoreInfo;
        }

        return {
            key: index,
            location: entry.name,
            streetAddress: entry.street,
            city: entry.city,
            zip: entry.zip,
            hasAppointments: entry.hasAvailability,
            totalAvailability: entry.totalAvailability || null,
            appointmentData: availability || null,
            isMassVax: entry.massVax || false,
            signUpLink: entry.signUpLink || null,
            extraData: extraData || null,
            restrictions: entry.restrictions || null,
            coordinates: {
                latitude: entry.latitude,
                longitude: entry.longitude,
            },
            timestamp: entry.timestamp ? new Date(entry.timestamp) : null,
        };
    });

    // Filter all massVax locations out.
    // We are going to show a consolidated "Preregistration" card instead.
    // There is still code to display these sites individually in
    // Availability.js and SignupLink.js if we decide to go that way later on.
    mappedData = mappedData.filter((d) => {
        return !d.isMassVax;
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

export function filterData(data, filters) {
    // Update the cookie
    setCookie("filter", filters);

    const { filterByAvailable, filterByZipCode } = filters;
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
    let testDataTransformed = null;

    if (
        process.env.NODE_ENV !== "production" &&
        process.env.REACT_APP_USE_DEVTEST_JSON === "true"
    ) {
        // This is a testing branch to get data from a local file instead of the production file.
        // See README.md to learn how to use this feature.

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
