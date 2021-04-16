import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles({
    label: {
        "margin-bottom": "5px",
    },
});

export default function PhoneNumber({ value, onChange, error }) {
    const classes = useStyles();
    return (
        <FormControl component="fieldset">
            <FormGroup>
                <FormLabel
                    htmlFor="phone"
                    component="label"
                    classes={{ root: classes.label }}
                >
                    Mobile phone number (USA):
                </FormLabel>
                <TextField
                    id="phone"
                    data-testid="phone"
                    name="phone"
                    size="small"
                    variant="outlined"
                    value={formatPhoneNumber(value)}
                    onChange={(e) =>
                        onChange(formatPhoneNumber(e.target.value))
                    }
                    error={error}
                    type="tel"
                    inputProps={{ maxLength: 14 }}
                    helperText={error && "Please enter a valid phone number."}
                />
            </FormGroup>
        </FormControl>
    );
}
PhoneNumber.propTypes = {
    error: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string,
};

export function formatPhoneNumber(phoneNumber) {
    let formattedPhone = phoneNumber || "";
    formattedPhone = formattedPhone.replace(/[^\d]/g, "");

    const [first, ...rest] = formattedPhone;
    // get rid of leading 1s (US country code)
    if (first === "1") {
        formattedPhone = rest.join("");
    }
    if (formattedPhone.length > 0) {
        formattedPhone = `(${formattedPhone}`;
    }
    if (formattedPhone.length > 4) {
        formattedPhone = `${formattedPhone.substring(
            0,
            4
        )}) ${formattedPhone.substring(4)}`;
    }
    if (formattedPhone.length > 9) {
        formattedPhone = `${formattedPhone.substring(
            0,
            9
        )}-${formattedPhone.substring(9)}`;
    }
    return formattedPhone;
}
