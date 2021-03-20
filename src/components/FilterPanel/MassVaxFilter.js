import { makeStyles } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles((theme) => ({
    tightCheckbox: {
        "padding-right": theme.spacing(0.5),
    },
}));

export default function MassVaxFilter(props) {
    const classes = useStyles();

    const handleChange = (e) => {
        return props.onChange(!!e.target.checked);
    };

    return (
        <FormControl component="fieldset" className={props.className}>
            <FormGroup>
                <FormControlLabel
                    style={{ display: "table" }}
                    control={
                        <div style={{ display: "table-cell" }}>
                            <Checkbox
                                checked={props.canShowMassVax}
                                onChange={handleChange}
                                name="canShowMassVax"
                                inputProps={{
                                    "data-testid": "massvax-checkbox",
                                }}
                                classes={{
                                    root: classes.tightCheckbox,
                                }}
                            />
                        </div>
                    }
                    label="Show mass vaccination locations"
                />
            </FormGroup>
        </FormControl>
    );
}

export function isMassVax(item) {
    return item.isMassVax;
}
