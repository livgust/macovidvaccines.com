import { convertDistance, getDistance } from "geolib";
import { isZipValid } from "./ZipCodeFilter";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";

// For performance, use a pared down list of Mass. zipcodes only (saves 374K or 60% of size!)
// const zipcodeData = require("us-zips");
import zipcodeData from "../../generated/ma-zips.json";

export default function RadiusFilter({ value, onChange }) {
    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">Distance (miles):</FormLabel>
            <RadioGroup
                aria-label="distance (miles)"
                name="distance-filter"
                value={value.toString()}
                onChange={(e) => onChange(parseInt(e.target.value))}
            >
                <FormControlLabel value="5" control={<Radio />} label="5" />
                <FormControlLabel value="10" control={<Radio />} label="10" />
                <FormControlLabel value="25" control={<Radio />} label="25" />
                <FormControlLabel
                    value="9999"
                    control={<Radio />}
                    label="50+"
                />
            </RadioGroup>
        </FormControl>
    );
}

export function isWithinRadius(item, zipCode, miles) {
    if (isZipValid(zipCode)) {
        const myCoordinates = zipcodeData[zipCode];
        item.miles = Math.round(
            convertDistance(
                getDistance(myCoordinates, item.coordinates, 1),
                "mi"
            )
        );

        // Is the location within the range specified?
        return item.miles <= miles;
    } else {
        return true; //default to returning everything when zip is invalid
    }
}
