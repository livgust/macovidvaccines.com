import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import Cookies from "universal-cookie";

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
        <FormControl component="fieldset">
            <FormGroup>
                <TextField
                    value={props.zipCode}
                    onChange={handleChange}
                    name="zipCode"
                    inputProps={{ "data-testid": "zip-input" }}
                    label="ZIP Code"
                    variant="outlined"
                    size="small"
                    type="number"
                />
            </FormGroup>
        </FormControl>
    );
}

export function isZipValid(zipCode) {
    return zipCode.match(/\d{5}/) && zipcodeData[zipCode];
}
