import Loader from "react-loader";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from '@material-ui/core/Button';
import RoomOutlined from '@material-ui/icons/RoomOutlined';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import TextField from "@material-ui/core/TextField"
import getDistance from 'geolib/es/getDistance';

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
			distance: entry.distance,
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
	onlyShowAvailable
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
	return newData;
}

const useStyles = makeStyles((theme) => ({
	cardBox: {
		"padding-top": theme.spacing(2),
		"padding-bottom": theme.spacing(2),
	},
	filterButtons: {
		"margin-top": theme.spacing(1),
		"margin-bottom": theme.spacing(1),
		"margin-left": theme.spacing(1)
	},
}));



export default function CovidAppointmentTable() {
	const classes = useStyles();
	const [loading, setLoading] = useState(false)
	const [currentLocation, setCurrentLocation] = useState({});
	const [zipcode, setZipcode] = useState(false)
	const [data, setData] = useState([]);
	const [sortInfo, setSortInfo] = useState({
		sortKey: "hasAppointments",
		sortAsc: false,
	});

	const [onlyShowAvailable, setOnlyShowAvailable] = useState(true);

	useEffect(() => {
		fetch("https://mzqsa4noec.execute-api.us-east-1.amazonaws.com/prod").then(
			async (res) => {
				const newData = await res.json();
				setData(JSON.parse(newData.body).results);
			}
		);
	}, []);

	useEffect(()=> {
		setLoading(true)
		setData(data => data.map(entry=> ({...entry, distance: getDistance(currentLocation, {latitude:Math.random() * 30, longitude: Math.random()*-75}) * 0.000621371 }))
		.sort((a,b) => a.distance > b.distance ? 1 : -1))
		setLoading(false)
	}, [currentLocation])

	const formattedData = sortAndFilterData(
		transformData(data),
		sortInfo,
		onlyShowAvailable
	);

	const getCurrentLocation = () => {
		navigator.geolocation.getCurrentPosition((position) => {
		  setCurrentLocation({latitude: position.coords.latitude, longitude: position.coords.longitude});
	  	})
	}

	const getZipcodeLocation = () => {
		fetch(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${zipcode}&facet=state&facet=timezone&facet=dst`).then(
			async (res) => {
				const {records} = await res.json();
				const {fields: {latitude, longitude}} = records[0]
				setCurrentLocation({latitude, longitude})
			}
		);
	}
	
	return (
		<Loader loaded={!!data && data.length > 0 && !loading}>
			<FormControlLabel
				control={
					<Switch
						checked={onlyShowAvailable}
						onChange={(event) => setOnlyShowAvailable(event.target.checked)}
					/>
				}
				label="Only show locations with available appointments"
			/>
			<div >
				<TextField id="outlined-basic" label="Enter Zipcode" variant="outlined" onChange={e => setZipcode(e.target.value)} />
				<Button className={classes.filterButtons} variant="contained" color="secondary" onClick={getZipcodeLocation}>Search By Zip</Button>
				<Button className={classes.filterButtons} variant="contained" color="secondary" startIcon={<GpsFixedIcon/>} onClick={getCurrentLocation}>Use My Location</Button>
			</div>
					
			{formattedData.map((entry) => {
				return (
					<div className={classes.cardBox}>
						<Card>
							<CardHeader
								title={<div>{entry.location}</div>}
								subheader={<><div>{entry.city}</div>{entry.distance && <div><RoomOutlined/>{Number.parseFloat(entry.distance).toFixed(1)} miles away</div>}</>}
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
		</Loader>
	);
}
