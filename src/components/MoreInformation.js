import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	accordion: {
		"margin-top": theme.spacing(2),
		"margin-bottom": theme.spacing(2),
		":last-child": { "margin-bottom": theme.spacing(2) },
	},
	buttonText: {
		...theme.typography.button,
	},
	extraDataContainer: {
		display: "block",
	},
	extraData: {
		display: "block",
		"padding-bottom": theme.spacing(1),
	},
	formattedExtraData: {
		color: "#F50057",
	},
}));

export default function MoreInformation({ entry }) {
	const classes = useStyles();
	if(!(entry.extraData == null)) {
		//reggie lewis uses markdown but not for emphasis so it skips that site
		if(!(entry.location == "Reggie Lewis State Track Athletic Ctr")) {
			var currentData = entry.extraData["Additional Information"];
			if(!(currentData == null)) {
				var splitDataEmStr = currentData.split("***");
				var i = 1;
				var newDataEmStr = splitDataEmStr[0];
				var isEmStr = false;
				while(i < splitDataEmStr.length) {
					if(isEmStr) {
						newDataEmStr = newDataEmStr + "</span></em>" + splitDataEmStr[i];
						isEmStr = false;
					}else{
						newDataEmStr = newDataEmStr + "<em><span class=\"formattedExtraData\">" + splitDataEmStr[i];
						isEmStr = true;
					}
					i++;
				}
				var splitDataStr = newDataEmStr.split("**");
				var i = 1;
				var newDataStr = splitDataStr[0];
				var isStr = false;
				while(i < splitDataStr.length) {
					if(isStr) {
						newDataStr = newDataStr + "</span>" + splitDataStr[i];
						isStr = false;
					}else{
						newDataStr = newDataStr + "<span class=\"formattedExtraData\">" + splitDataStr[i];
						isStr = true;
					}
					i++;
				}
				var splitDataEm = newDataStr.split("*");
				var i = 1;
				var newDataEm = splitDataEm[0];
				var isEm = false;
				while(i < splitDataEm.length) {
					if(isEm) {
						newDataEm = newDataEm + "</em>" + splitDataEm[i];
						isEm = false;
					}else{
						newDataEm = newDataEm + "<em>" + splitDataEm[i];
						isEm = true;
					}
					i++;
				}
				entry.extraData["Additional Information"] = newDataEm;
			}
		}
	}
	return (
		<Accordion className={classes.accordion}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				className={classes.buttonText}
			>
				More Information
			</AccordionSummary>
			<AccordionDetails className={classes.extraDataContainer}>
				<div className={classes.extraData}>
					<b>Address:</b> {entry.streetAddress}, {entry.city}, MA {entry.zip}
				</div>
				<ExtraData data={entry.extraData} />
			</AccordionDetails>
		</Accordion>
	);
}

function ExtraData({ data }) {
    const classes = useStyles();

    if (!data) {
        return null;
    } else if (typeof data == "string") {
        return <div>data</div>;
    } else if (typeof data == "object") {
        let elements = [];
        for (const key in data) {
            elements.push(
                <div className={classes.extraData}>
                    <b>{key}:</b> {data[key]}
                </div>
            );
        }
        return elements;
    }
}
