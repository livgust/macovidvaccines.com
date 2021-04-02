import { convertDistance, getDistance } from "geolib";
import { isZipValid } from "./ZipCodeFilter";
import { makeStyles } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";
import zipcodeData from "../../generated/ma-zips.json";
// For performance, use a pared down list of Mass. zipcodes only (saves 374K or 60% of size!)
// const zipcodeData = require("us-zips");

const useStyles = makeStyles((theme) => ({
    narrowRadio: {
        "padding-right": theme.spacing(0.5),
    },
    padBetweenChoices: {
        "&:not(:first-of-type)": {
            "padding-left": theme.spacing(0.5),
        },
        "&:last-of-type": {
            "margin-right": 0,
        },
    },
}));

function RadiusRadio({ radius, label }) {
    const classes = useStyles();

    let labelToUse = radius;
    if (label) {
        labelToUse = label;
    }
    return (
        <FormControlLabel
            value={radius}
            control={<Radio classes={{ root: classes.narrowRadio }} />}
            label={labelToUse}
            classes={{ root: classes.padBetweenChoices }}
        />
    );
}

export default function RadiusFilter({ value, onChange }) {
    return (
        <FormControl component="fieldset">
            <FormLabel component="label">Distance (miles):</FormLabel>
            <RadioGroup
                aria-label="distance (miles)"
                name="distance-filter"
                value={value.toString()}
                onChange={(e) => onChange(parseInt(e.target.value))}
                row
            >
                <RadiusRadio radius="9999" label="Any" />
                <RadiusRadio radius="10" />
                <RadiusRadio radius="25" />
                <RadiusRadio radius="50" />
            </RadioGroup>
        </FormControl>
    );
}

export function isWithinRadius(item, zipCode, miles) {
    if (
        isZipValid(zipCode) &&
        item.coordinates.latitude &&
        item.coordinates.longitude
    ) {
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
