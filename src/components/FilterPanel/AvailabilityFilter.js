import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { hasSignUpLink } from "../SignUpLink";
export default function AvailabilityFilter(props) {
    const handleChange = (e) => {
        return props.onChange(!!e.target.checked);
    };

    return (
        <FormControl component="fieldset" className={props.className}>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={props.onlyShowAvailable}
                            onChange={handleChange}
                            name="onlyShowAvailable"
                            inputProps={{
                                "data-testid": "availability-checkbox",
                            }}
                        />
                    }
                    label="Has Available Appointments"
                />
            </FormGroup>
        </FormControl>
    );
}

export function isAvailable(item) {
    return hasSignUpLink(item);
}
