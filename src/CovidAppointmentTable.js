import Loader from "react-loader";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import RoomOutlined from "@material-ui/icons/RoomOutlined";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import TextField from "@material-ui/core/TextField";
import getDistance from "geolib/es/getDistance";

import Availability from "./components/Availability";
import SignUpLink from "./components/SignUpLink";
import MoreInformation from "./components/MoreInformation";

export function transformData(data) {
    return data.map((entry, index) => {
        return {
            key: index,
            location: entry.name,
            streetAddress: entry.street,
            city: entry.city,
            zip: entry.zip,
            hasAppointments: entry.hasAvailability,
            appointmentData: entry.availability || null,
            signUpLink: entry.signUpLink || null,
            extraData: entry.extraData || null,
        };
    });
}

export function sortAndFilterData(
    data,
    { sortKey, sortAsc },
    onlyShowAvailable,
    sortByDistance,
    currentLocation
) {
    const filteredData = onlyShowAvailable
        ? data.filter((entry) => entry.hasAppointments)
        : data;
    const newData = filteredData.sort((a, b) => {
        const first = sortAsc ? a[sortKey] : b[sortKey];
        const second = sortAsc ? b[sortKey] : a[sortKey];
        if (typeof first == "string") {
            return first.localeCompare(second);
        } else {
            return first - second;
        }
    });

    if (sortByDistance && !!currentLocation) {
        return newData
            .map((entry) => ({
                ...entry,
                distance:
                    entry.latitude && entry.longitude
                        ? getDistance(currentLocation, {
                              latitude: entry.latitude,
                              longitude: entry.longitude,
                          }) * 0.000621371
                        : null,
            }))
            .sort((a, b) => (a.distance > b.distance ? 1 : -1));
    } else {
        return newData;
    }
}

const useStyles = makeStyles((theme) => ({
    cardBox: {
        "padding-top": theme.spacing(2),
        "padding-bottom": theme.spacing(2),
    },
    filterButtons: {
        "margin-top": theme.spacing(1),
        "margin-bottom": theme.spacing(1),
        "margin-left": theme.spacing(1),
    },
    locationsNotFound: {
        margin: theme.spacing(1, "auto"),
    },
    notFoundBox: {
        display: "grid",
    },
}));

export default function CovidAppointmentTable() {
    const classes = useStyles();
    const [ready, setReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [currentLocation, setCurrentLocation] = useState({});
    const [zipcode, setZipcode] = useState("");
    const [data, setData] = useState([]);
    const [sortInfo, setSortInfo] = useState({
        sortKey: "hasAppointments",
        sortAsc: false,
    });

    const [onlyShowAvailable, setOnlyShowAvailable] = useState(true);
    const [sortByDistance, setSortByDistance] = useState(false);

    useEffect(() => {
        resetData();
    }, []);

    const resetData = () => {
        fetch("https://mzqsa4noec.execute-api.us-east-1.amazonaws.com/prod")
            .then(async (res) => {
                const newData = await res.json();
                setData(JSON.parse(newData.body).results);
                setReady(true);
            })
            .catch((ex) => {
                console.error(ex.message);
                setErrorMessage(
                    "something went wrong, please try again later."
                );
                setReady(true);
            });
    };

    const formattedData = sortAndFilterData(
        transformData(data),
        sortInfo,
        onlyShowAvailable,
        sortByDistance,
        currentLocation
    );

    const getCurrentLocation = () => {
        setZipcode("");
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            setSortByDistance(true);
        });
    };

    const getZipcodeLocation = () => {
        fetch(
            `https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${zipcode}&facet=state&facet=timezone&facet=dst`
        ).then(async (res) => {
            const { records } = await res.json();
            const {
                fields: { latitude, longitude },
            } = records[0];
            setCurrentLocation({ latitude, longitude });
            setSortByDistance(true);
        });
    };

    return (
        <>
            <div
                aria-label="loading data"
                id="progress"
                role="progressbar"
                aria-valuetext={ready ? "loaded" : "waiting"}
            >
                <Loader loaded={ready} />
            </div>

            <div>
                <TextField
                    id="outlined-basic"
                    label="Enter Zipcode"
                    variant="outlined"
                    onChange={(e) => setZipcode(e.target.value)}
                    value={zipcode}
                />
                <Button
                    className={classes.filterButtons}
                    variant="contained"
                    color="secondary"
                    onClick={getZipcodeLocation}
                >
                    Search By Zip
                </Button>
                <Button
                    className={classes.filterButtons}
                    variant="contained"
                    color="secondary"
                    startIcon={<GpsFixedIcon />}
                    onClick={getCurrentLocation}
                >
                    Use My Location
                </Button>
            </div>

            {errorMessage && <div role="alert">{errorMessage}</div>}

            <section aria-live="polite" aria-busy={!ready}>
                <FormControlLabel
                    control={
                        <Switch
                            aria-checked={onlyShowAvailable}
                            role="switch"
                            checked={onlyShowAvailable}
                            onChange={(event) =>
                                setOnlyShowAvailable(event.target.checked)
                            }
                        />
                    }
                    label="Only show locations with available appointments"
                />
                {ready && formattedData.length === 0 && (
                    <div role="status">
                        <p>No appointments found.</p>
                    </div>
                )}
                <div role="list">
                    {formattedData.map((entry) => {
                        return (
                            <div
                                role="listitem"
                                key={`${entry.location}-${entry.streetAdress}-${entry.city}`}
                                className={classes.cardBox}
                            >
                                <Card>
                                    <CardHeader
                                        title={<div>{entry.location}</div>}
                                        subheader={
                                            <>
                                                <div>{entry.city}</div>
                                                {!!entry.distance ? (
                                                    <div>
                                                        <RoomOutlined />
                                                        {Number.parseFloat(
                                                            entry.distance
                                                        ).toFixed(1)}{" "}
                                                        miles away
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </>
                                        }
                                    />
                                    <CardContent>
                                        <Availability entry={entry} />
                                        <MoreInformation entry={entry} />
                                        <SignUpLink entry={entry} />
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );
}
