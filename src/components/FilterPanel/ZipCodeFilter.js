import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import Input from "@material-ui/core/Input";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Cookies from "universal-cookie";
import { convertDistance, getDistance } from "geolib";

// For performance, use a pared down list of Mass. zipcodes only (saves 374K or 60% of size!)
// const zipcodeData = require("us-zips");
import zipcodeData from "../../generated/ma-zips.json";

const cookies = new Cookies();
export function getZipCodeCookie() {
    const savedZip = cookies.get("ZIPCode");
    return savedZip ? savedZip : "";
}
export default function ZipCodeFilter(props) {
    const handleChange = (e) => {
        const targetZip = e.target.value;
        const zipValid = targetZip === "" || targetZip.match(/\d{5}/);
        /* TODO: we have a mix of cookie stuff in and out of this component.
         * It should all be in one place. */
        if (zipValid) {
            cookies.set("ZIPCode", targetZip, { path: "/" });
        }
        props.onChange(targetZip);
    };

    return (
        <FormControl component="fieldset" className={props.className}>
            {/*<FormLabel component="legend"></FormLabel>*/}
            <FormGroup>
                <FormControlLabel
                    control={
                        <Input
                            value={props.zipCode}
                            onChange={handleChange}
                            name="zipCode"
                            inputProps={{ "data-testid": "zip-input" }}
                        />
                    }
                    label="ZIP Code"
                    labelPlacement="top"
                    aria-label="ZIP Code"
                />
            </FormGroup>
        </FormControl>
    );
}

export function isWithinRadius(item, zipCode, miles) {
    const zipValid = zipCode.match(/\d{5}/);
    if (zipValid) {
        const myCoordinates = zipcodeData[zipCode];
        if (myCoordinates) {
            //setSortBy("miles");
            item.miles = Math.round(
                convertDistance(
                    getDistance(myCoordinates, item.coordinates, 1),
                    "mi"
                )
            );

            // Is the location within the range specified?
            return item.miles <= miles;
        } else {
            return true;
        }
    } else {
        return true; //default to returning everything when zip is invalid
    }
}
