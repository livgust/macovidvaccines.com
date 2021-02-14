import React from "react";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import Availability from "./components/Availability";
import SignUpLink from "./components/SignUpLink";
import MoreInformation from "./components/MoreInformation";
import { sortData } from "./services/appointmentData.service";


const useStyles = makeStyles((theme) => ({
	cardBox: {
		"padding-top": theme.spacing(2),
		"padding-bottom": theme.spacing(2),
	},
}));

export default function CovidAppointmentTable(props) {
	const classes = useStyles();

	const sortedData = sortData(
		props.data,
		{
			sortKey: "hasAppointments",
			sortAsc: false,
		}
	)

	console.log(sortedData);

	// generate unique key for each site
	const getSiteId = (site) => {
		return btoa(
			JSON.stringify(site)
				.split('')
				.map(c => c.charCodeAt(0).toString())
				.join('')
		);
	};

	return (
		<>
			{sortedData.map((entry) => {
				return (
					<div key={getSiteId(entry)} className={classes.cardBox}>
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
		</>
	);
}
