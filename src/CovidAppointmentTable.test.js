import { transformData } from "./CovidAppointmentTable";

test("returns an array", () => {
	expect(Array.isArray(transformData([]))).toBeTruthy();
});

test("data with object maps as expected", () => {
	const testData = [
		{
			name: "UMass Amherst Campus Center",
			street: "1 Campus Center Way",
			city: "Amherst",
			zip: "01003",
			website: "https://uma.force.com/covidtesting/s/first-responders",
			signUpLink: "https://uma.force.com/covidtesting/s/first-responders",
			hasAvailability: true,
		},
	];

	expect(transformData(testData)).toEqual([
		{
			location: "UMass Amherst Campus Center",
			streetAddress: "1 Campus Center Way",
			city: "Amherst",
			zip: "01003",
			hasAppointments: "Y",
			appointmentData: null,
			signUpLink: "https://uma.force.com/covidtesting/s/first-responders",
			extraData: null,
		},
	]);
});

test("data with array maps as expected", () => {
	const testData = [
		{
			name: "Gillette Stadium",
			street: "Gillette Stadium",
			city: "Foxborough",
			zip: "02035",
			signUpLink:
				"https://www.maimmunizations.org/client/registration?clinic_id=995",
			availability: {
				"02/01/2021": {
					hasAvailability: false,
					numberAvailableAppointments: 0,
				},
				"02/02/2021": {
					hasAvailability: true,
					numberAvailableAppointments: 1,
				},
			},
			hasAvailability: true,
			extraData: {
				"Vaccinations offered": "Moderna COVID-19 Vaccine",
				"Age groups served": "Adults, Seniors",
				"Services offered": "Vaccination",
				"Additional Information":
					"***Per the Commonwealth of Massachusetts' vaccine distribution timeline, this clinic is for all Phase 1 priority groups, plus the first priority group in Phase 2: individuals ages 75 and older.*** Please arrive only 5 minutes prior to your appointment (not sooner or later) and bring proof of eligibility. Please remember to wear a mask and practice social distancing at all times. You should expect to be at the vaccination site for about 60-75 minutes, all told — from the time you check in until your post-shot observation period ends. There is a 15-minute variance depending on the duration required for your post-shot observation.",
				"Clinic Hours": "08:00 am - 06:00 pm",
			},
		},
	];

	expect(transformData(testData)).toEqual([
		{
			location: "Gillette Stadium",
			streetAddress: "Gillette Stadium",
			city: "Foxborough",
			zip: "02035",
			hasAppointments: "Y",
			appointmentData: {
				"02/01/2021": {
					hasAvailability: false,
					numberAvailableAppointments: 0,
				},
				"02/02/2021": {
					hasAvailability: true,
					numberAvailableAppointments: 1,
				},
			},
			signUpLink:
				"https://www.maimmunizations.org/client/registration?clinic_id=995",
			extraData: {
				"Vaccinations offered": "Moderna COVID-19 Vaccine",
				"Age groups served": "Adults, Seniors",
				"Services offered": "Vaccination",
				"Additional Information":
					"***Per the Commonwealth of Massachusetts' vaccine distribution timeline, this clinic is for all Phase 1 priority groups, plus the first priority group in Phase 2: individuals ages 75 and older.*** Please arrive only 5 minutes prior to your appointment (not sooner or later) and bring proof of eligibility. Please remember to wear a mask and practice social distancing at all times. You should expect to be at the vaccination site for about 60-75 minutes, all told — from the time you check in until your post-shot observation period ends. There is a 15-minute variance depending on the duration required for your post-shot observation.",
				"Clinic Hours": "08:00 am - 06:00 pm",
			},
		},
	]);
});
