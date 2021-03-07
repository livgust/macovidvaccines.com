/*
 * Generate a pared down list of Massachusetts zipcodes with their
 * longitude and latitude.
 *
 */

const fs = require("fs");
const zipcodes = require("zipcodes-perogi");

const MAZipcodes = zipcodes.lookupByState("MA");

/*
 * 'zipcodes-perogi' gives us this form, which is more than we need:
 * [ ... {
 *   zip: '02130',
 *   city: 'Jamaica Plain',
 *   state: 'MA',
 *   latitude: '42.29472',
 *   longitude: '-71.13054',
 *   timeZoneId: 'America/New_York'
 * } ... ]
 *
 * Previously we were using 'uszips', which gives us:
 * { ... {
 *   '02130': {
 *     latitude: '42.29472',
 *     longitude: '-71.13054'
 * } ... }
 *
 */

const MAZipcodesSmaller = Object.fromEntries(
    MAZipcodes.map((z) => [
        z.zip,
        { city: z.city, latitude: z.latitude, longitude: z.longitude },
    ])
);

fs.writeFileSync(
    "src/generated/ma-zips.json",
    JSON.stringify(MAZipcodesSmaller),
    null,
    null
);
