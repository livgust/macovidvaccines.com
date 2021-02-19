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
}));

export default function MoreInformation({ entry }) {
    const classes = useStyles();
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
                    <b>Address:</b> {entry.streetAddress}, {entry.city}, MA{" "}
                    {entry.zip}
                </div>
                {entry.restrictions && (
                    <div className={classes.extraData}>
                        <b>Restrictions:</b> {entry.restrictions}
                    </div>
                )}
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
        return <div>{data}</div>;
    } else if (typeof data == "object") {
        let elements = [];
        for (const key in data) {
            elements.push(
                <div key={key} className={classes.extraData}>
                    <b>{key}:</b> {data[key]}
                </div>
            );
        }
        return elements;
    }
}
