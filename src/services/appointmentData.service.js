import { isAvailable } from "../components/FilterPanel/AvailabilityFilter";
import { isWithinRadius } from "../components/FilterPanel/RadiusFilter";

const dayjs = require("dayjs");

// any location with data older than this will not be displayed at all
export const tooStaleMinutes = 60; // unit in minutes

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
            for (const [key, value] of Object.entries(entry.availability)) {
                let newKey = dayjs(key).format(ourDateFormat);
                availability[newKey] = value;
            }
        }

        let extraData = entry.extraData;
        console.log(extraData);
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
            appointmentData: availability || null,
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
    return fetch(
        "https://mzqsa4noec.execute-api.us-east-1.amazonaws.com/prod"
    ).then(async (res) => {
        return transformData(JSON.parse((await res.json()).body).results);
    });
}
