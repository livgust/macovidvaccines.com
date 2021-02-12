import Loader from "react-loader";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
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
}));

export default function CovidAppointmentTable() {
	const classes = useStyles();

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
				setData(JSON.parse(newData.body).results || []);
			}
		).catch(
                  (ex) => setData([])
                );
	}, []);

	const formattedData = sortAndFilterData(
		transformData(data),
		sortInfo,
		onlyShowAvailable
	);

	return (
		<Loader loaded={!!data && data.length > 0}>
			<FormControlLabel
				control={
					<Switch
						checked={onlyShowAvailable}
						onChange={(event) => setOnlyShowAvailable(event.target.checked)}
					/>
				}
				label="Only show locations with available appointments"
			/>
			{formattedData.map((entry) => {
				return (
				  	<div key={`${entry.location}-${entry.city}`} className={classes.cardBox}>
						<Card>
							<CardHeader
								title={<div>{entry.location}</div>}
								subheader={<div>{entry.city}</div>}
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
