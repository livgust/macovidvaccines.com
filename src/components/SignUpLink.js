import Button from "@material-ui/core/Button";

export default function SignUpLink({ entry }) {
	if (entry.hasAppointments) {
		return entry.signUpLink ? (
			<Button
				variant="contained"
				color="secondary"
				href={entry.signUpLink}
				rel="noreferrer"
				target="_blank"
			>
				Sign Up
			</Button>
		) : (
			"No sign-up link available."
		);
	} else {
		return <div></div>;
	}
}
