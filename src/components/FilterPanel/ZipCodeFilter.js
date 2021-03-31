import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    error: {
        "& .MuiFormHelperText-contained.Mui-error": {
            color: "#AD003B",
        },
        "& .Mui-error .MuiOutlinedInput-notchedOutline": {
            "border-color": "#AD003B",
        },
    },
    label: {
        "margin-bottom": "5px",
    },
});

// For performance, use a pared down list of Mass. zipcodes only (saves 374K or 60% of size!)
// const zipcodeData = require("us-zips");
import zipcodeData from "../../generated/ma-zips.json";

export default function ZipCodeFilter(props) {
    const classes = useStyles();

    const handleChange = (e) => {
        props.onChange(zipInputFilter(e.target.value).formattedZip);
    };

    const error = showZipError(props.zipCode);

    return (
        <FormControl component="fieldset">
            <FormGroup>
                <FormLabel
                    htmlFor="zip-code"
                    component="label"
                    classes={{ root: classes.label }}
                >
                    ZIP Code:
                </FormLabel>
                <TextField
                    classes={{ root: classes.error }}
                    value={props.zipCode}
                    onChange={handleChange}
                    name="zip-code"
                    id="zip-code"
                    FormHelperTextProps={{ "data-test-id": "zip-error" }}
                    inputProps={{ "data-testid": "zip-input" }}
                    variant="outlined"
                    size="small"
                    type="text"
                    error={error}
                    helperText={error && "Enter a ZIP Code in Massachusetts."}
                />
            </FormGroup>
        </FormControl>
    );
}

export function zipInputFilter(value) {
    const targetZip = value.replace(/[^\d]/g, "");
    const zipValid = targetZip === "" || targetZip.match(/\d{5}/);
    return {
        formattedZip: targetZip,
        zipValid,
    };
}

export function isZipValid(zipCode) {
    return zipCode.match(/\d{5}/) && zipcodeData[zipCode];
}

function showZipError(zipCode) {
    return !!zipCode && zipCode.length >= 5 && !isZipValid(zipCode);
}
