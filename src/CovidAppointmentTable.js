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
  const [ready, setReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
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
                          setReady(true);
			}
		).catch(
                  (ex) => {
                    console.error(ex.message);
                    setErrorMessage('something went wrong, please try again later.');
                    setReady(true);
                  }
                );
	}, []);

	const formattedData = sortAndFilterData(
		transformData(data),
		sortInfo,
		onlyShowAvailable
	);

  return (
    <>
      <div id="progress" role="progressbar" aria-valuetext={ready ? 'loaded' : 'waiting'}>
	<Loader loaded={ready} />
      </div>

      {errorMessage && (<div role="alert">{errorMessage}</div>)}

      <section aria-live="polite" aria-describedby="progress" aria-busy={!ready}>
			<FormControlLabel
				control={
			    <Switch
                              role="switch"
						checked={onlyShowAvailable}
						onChange={(event) => setOnlyShowAvailable(event.target.checked)}
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
				  	<div role="listitem" key={`${entry.location}-${entry.city}`} className={classes.cardBox}>
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
            </div>
      </section>
    </>
	);
}
