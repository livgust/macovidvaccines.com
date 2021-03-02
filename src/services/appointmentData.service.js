const dayjs = require("dayjs");

// any location with data older than this will not be displayed at all
export const tooStaleMinutes = 60; // unit in minutes

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
            timestamp: entry.timestamp ? new Date(entry.timestamp) : null,
        };
    });

    // Pre-Filter the locations that have "non-stale" data
    const oldestGoodTimestamp = new Date() - tooStaleMinutes * 60 * 1000;
    return mappedData.filter((d) => {
        return !d.timestamp || d.timestamp >= oldestGoodTimestamp;
    });
}

export function sortData(data, { sortKey, sortAsc }) {
    const newData = data.sort((a, b) => {
        const first = sortAsc ? a[sortKey] : b[sortKey];
        const second = sortAsc ? b[sortKey] : a[sortKey];
        if (typeof first == "string") {
            return first.localeCompare(second);
        } else {
            return first - second;
        }
    });
    return newData;
}

export function filterData(data, filters) {
    const filterNames = Object.keys(filters);

    return data.filter((d) => {
        for (let i = 0; i < filterNames.length; i++) {
            if (!filters[filterNames[i]](d)) {
                return false;
            }
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
