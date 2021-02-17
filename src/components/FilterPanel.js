import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
    formControlLabel: {
        "text-align": "left",
        "align-items": "start",
        "margin-top": theme.spacing(1),
        width: `calc(100% - ${theme.spacing(4)}px)`,
    },
    mdPanel: {
        position: "sticky",
        top: 0,
        height: "200px",
    },
}));

export default function FilterPanel(props) {
    const classes = useStyles();
    const theme = useTheme();
    const mdSize = useMediaQuery(theme.breakpoints.up("md"));

    const [hasAppointments, setHasAppointments] = useState(true);
    const [vaxType, setVaxType] = useState("Any");

    const { data, onChange } = props;

    useEffect(() => {
        onChange({
            hasAppointments: (d) => !hasAppointments || !!d.hasAppointments,
            vaxType: (d) => {
                if (vaxType === "Any") {
                    return true;
                } else {
                    if (d.extraData && d.extraData["Vaccinations offered"]) {
                        return d.extraData["Vaccinations offered"].includes(
                            vaxType
                        );
                    } else {
                        return false;
                    }
                }
            },
        });
    }, [onChange, hasAppointments, vaxType]);

    const vaxTypes = Array.from(
        new Set(
            data.reduce(
                (acc, cur) => {
                    if (
                        cur.extraData &&
                        cur.extraData["Vaccinations offered"]
                    ) {
                        acc = acc.concat(
                            cur.extraData["Vaccinations offered"]
                                .split(",")
                                .map((d) => d.trim())
                        );
                    }
                    return acc;
                },
                ["Any"]
            )
        )
    );

    return (
        <Grid container={true} className={mdSize ? classes.mdPanel : ""}>
            <Container>
                <Typography component="span">
                    <h3>Only show locations with:</h3>
                </Typography>
            </Container>

            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={hasAppointments}
                            aria-checked={hasAppointments}
                            role="switch"
                            onChange={(event) => {
                                setHasAppointments(event.target.checked);
                            }}
                        />
                    }
                    label="Available appointments:"
                    labelPlacement="top"
                    className={classes.formControlLabel}
                />
            </Grid>

            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Select
                            value={vaxType}
                            onChange={(event) => setVaxType(event.target.value)}
                            fullWidth={true}
                        >
                            {vaxTypes.map((t) => (
                                <MenuItem key={t} value={t}>
                                    {t}
                                </MenuItem>
                            ))}
                        </Select>
                    }
                    label="Vaccine type:&nbsp;&nbsp;"
                    labelPlacement="top"
                    className={classes.formControlLabel}
                />
            </Grid>
        </Grid>
    );
}
