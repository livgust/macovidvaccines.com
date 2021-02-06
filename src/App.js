import CovidAppointmentTable from "./CovidAppointmentTable";
import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Menu from "./components/Menu";
import { makeStyles } from "@material-ui/core";

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
	return (
		<>
			<Menu />
			<div className={classes.main}>
				<Grid container justify="center" spacing={3}>
					<Grid item xs={1} sm={2}></Grid>
					<Grid item xs={10} sm={8}>
						<h1 className={classes.heading}>MA Covid Vaccine Appointments</h1>
						<CovidAppointmentTable />
						<Typography variant="caption" display="block" gutterBottom>
							&#169; {new Date().getFullYear()} Olivia Adams
						</Typography>
					</Grid>
					<Grid item xs={1} sm={2}></Grid>
				</Grid>
			</div>
		</>
	);
}

export default App;
