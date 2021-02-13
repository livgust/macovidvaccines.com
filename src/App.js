import React, { useEffect, useState } from "react";
import Loader from "react-loader";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Menu from "./components/Menu";
import { makeStyles } from "@material-ui/core";

import CovidAppointmentTable from "./CovidAppointmentTable";
import FilterPanel from "./components/FilterPanel";
import { filterData, getAppointmentData } from "./services/appointmentData.service";


const useStyles = makeStyles((theme) => ({
	main: {
		padding: theme.spacing(2),
	},
	heading: {
		"text-align": "center",
	},
}));

function App() {
	const classes = useStyles();

	const [data, setData] = useState([]);
	const [filters, setFilters] = useState({});

	useEffect(() => {
		getAppointmentData().then(setData);
	}, []);

	const filteredData = filterData(data, filters);

	return (
		<>
			<Menu />
			<div className={classes.main}>
				<Grid container justify="center" spacing={3}>
					<Loader loaded={!!data && data.length > 0}>
						<Grid container={true}>
							<Grid item xs={false} md={3}></Grid>
							<Grid item xs={12} md={9}>
								<h1 className={classes.heading}>MA Covid Vaccine Appointments</h1>
							</Grid>
							<Grid item xs={12} md={3}>
								<FilterPanel data={data} onChange={setFilters} />
							</Grid>
							<Grid item xs={12} md={9}>
								<CovidAppointmentTable data={filteredData} />
								<Typography variant="caption" display="block" gutterBottom>
									This site is not affiliated with or endorsed by the Commonwealth of Massachusetts.<br />
									This site is for informational purposes only.   Not all vaccination locations are tracked and the information may not be complete or accurate.<br />
									Copyright &#169; {new Date().getFullYear()} Olivia Adams. All rights reserved.
								</Typography>
							</Grid>
						</Grid>
					</Loader>
				</Grid>
			</div>
		</>
	);
}

export default App;
