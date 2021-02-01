import Loader from "react-loader";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

export function transformData(data) {
	return data.map((entry) => {
		return {
			location: entry.name,
			streetAddress: entry.street,
			city: entry.city,
			zip: entry.zip,
			hasAppointments: entry.hasAvailability ? "Yes" : "No",
			appointmentData: entry.availability || null,
			signUpLink: entry.signUpLink || null,
			//extraData: entry.extraData || null,
		};
	});
}

export function sortData(data, { sortKey, sortAsc }) {
	console.log(sortKey);
	const newData = data.sort((a, b) => {
		const first = sortAsc ? a[sortKey] : b[sortKey];
		const second = sortAsc ? b[sortKey] : a[sortKey];
		if (typeof first == "string") {
			return first.localeCompare(second);
		} else {
			return first - second;
		}
	});
	console.log(newData);
	return newData;
}

export default function CovidAppointmentTable() {
	const [data, setData] = useState([]);
	const [sortInfo, setSortInfo] = useState({
		sortKey: "hasAppointments",
		sortAsc: false,
	});
	useEffect(() => {
		fetch("https://mzqsa4noec.execute-api.us-east-1.amazonaws.com/prod").then(
			async (res) => {
				const newData = await res.json();
				setData(JSON.parse(newData.body).results);
			}
		);
	}, []);

	const columns = [
		{ header: "Location", key: "location", defaultSorting: "ASC" },
		{ header: "Street Address", key: "streetAddress", sortable: false },
		{ header: "City", key: "city", sortable: true },
		{ header: "ZIP", key: "zip", sortable: true },
		{
			header: "Has Available Appointments",
			key: "hasAppointments",
			sortable: true,
		},
		{
			header: "Available Appointments",
			key: "appointmentData",
			sortable: true,
			render: (data, parentElement) => {
				const availableSlots = [];
				for (const date in data) {
					if (data[date].hasAvailability) {
						availableSlots.push({
							date: date,
							...data[date],
						});
					}
				}
				if (!availableSlots.length && parentElement.hasAppointments === "Yes") {
					return <div>No date-specific data available.</div>;
				} else {
					return (
						<div>
							{availableSlots.map((slot) => (
								<div>
									{slot.date}:{" "}
									{slot.numberAvailableAppointments
										? `${slot.numberAvailableAppointments} slots`
										: "slots available"}
								</div>
							))}
						</div>
					);
				}
			},
		},
		{
			header: "Sign-up Link",
			key: "signUpLink",
			sortable: false,
			render: (data, parentElement) => {
				if (parentElement.hasAppointments === "Yes") {
					return data ? <a href={data}>Click Here</a> : "No link available.";
				} else {
					return <div></div>;
				}
			},
		},
	];
	return (
		<Loader loaded={!!data && data.length > 0}>
			<TableContainer component={Paper}>
				<Table size="small">
					<TableHead>
						<TableRow>
							{columns.map((col) => (
								<TableCell>{col.header}</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{sortData(transformData(data), sortInfo).map((entry) => (
							<TableRow>
								{columns.map((col) => {
									const entryDataPiece = entry[col.key] || null;
									return (
										<TableCell>
											{col.render
												? col.render(entryDataPiece, entry)
												: entryDataPiece || ""}
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Loader>
	);
}
