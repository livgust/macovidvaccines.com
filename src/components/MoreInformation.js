import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core";
import { sanitize } from "dompurify";
import grey from "@material-ui/core/colors/grey";

const useStyles = makeStyles((theme) => ({
    accordion: {
        "margin-top": theme.spacing(2),
        "margin-bottom": theme.spacing(2),
        ":last-child": { "margin-bottom": theme.spacing(2) },
    },
    accordionExpanded: {
        backgroundColor: grey[300],
    },
    buttonText: {
        ...theme.typography.button,
    },
    extraDataContainer: {
        display: "block",
    },
    extraData: {
        display: "block",
        "padding-top": theme.spacing(1),
    },
}));

export default function MoreInformation({ entry }) {
    const classes = useStyles();

    if (!(entry.streetAddress || entry.restrictions || entry.extraData)) {
        return null;
    }

    if (!(entry.restrictions || entry.extraData)) {
        return <StreetAddress entry={entry} classes={classes} />;
    } else {
        return (
            <Accordion className={classes.accordion}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    classes={{
                        root: classes.buttonText,
                        expanded: classes.accordionExpanded,
                    }}
                >
                    More Information
                </AccordionSummary>
                <AccordionDetails className={classes.extraDataContainer}>
                    <StreetAddress entry={entry} classes={classes} />
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
}

function StreetAddress({ entry, classes }) {
    if (!entry.streetAddress) return null;

    const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        `${entry.streetAddress}, ${entry.city}, MA ${entry.zip}`
    )}`;

    return (
        <div className={classes.accordion}>
            <b>Address: </b>
            <Link target="_blank" rel="noreferrer" href={googleMapsLink}>
                {entry.streetAddress}
                {", "}
                {entry.city},{" MA "}
                {entry.zip}
            </Link>
        </div>
    );
}

function ExtraData({ data }) {
    const classes = useStyles();

    if (!data) {
        return null;
    } else if (typeof data === "string") {
        return <div>{data}</div>;
    } else if (typeof data === "object") {
        let elements = [];
        for (const key in data) {
            //formats additional information instead of just adding it to the more information section
            if (key === "Additional Information") {
                const currentData = data[key];
                if (currentData) {
                    let finalData = parseMD(currentData);
                    //adds the parsed data as straight html
                    elements.push(
                        <div
                            key={key}
                            className={classes.extraData}
                            dangerouslySetInnerHTML={{
                                __html: `<b>${key}:</b> ${finalData}`,
                            }}
                        />
                    );
                }
            } else {
                elements.push(
                    <div key={key} className={classes.extraData}>
                        <b>{key}:</b> {data[key]}
                    </div>
                );
            }
        }
        return elements;
    }
}

function parseMD(currentData) {
    //replaces first instance of additional information if it's at the beginning of the string
    let splitAddInfo = currentData.split("Additional Information:");
    let workingData = "";
    if (splitAddInfo[0] === "") {
        workingData = currentData.replace("Additional Information:", "");
    } else {
        workingData = currentData;
    }
    //parses bold italics first, splitting data at each "***"
    const splitDataEmStr = workingData.split("***");
    let newDataEmStr = splitDataEmStr[0];
    let isEmStr = false;
    //iterates through the split data
    //uses em to italicize and span with the secondary color for bolding (went with a color change since the titles were bold)
    let i = 0;
    for (i = 1; i < splitDataEmStr.length; i++) {
        if (isEmStr) {
            newDataEmStr += splitDataEmStr[i];
            isEmStr = false;
        } else {
            newDataEmStr += `<em><strong>${splitDataEmStr[i]}</strong></em>`;
            isEmStr = true;
        }
    }
    //parses bold next, splitting data at each "**"
    const splitDataStr = newDataEmStr.split("**");
    let newDataStr = splitDataStr[0];
    let isStr = false;
    //iterates through the split data
    //same formatting rules as 85
    for (i = 1; i < splitDataStr.length; i++) {
        if (isStr) {
            newDataStr += splitDataStr[i];
            isStr = false;
        } else {
            newDataStr += `<strong>${splitDataStr[i]}</strong>`;
            isStr = true;
        }
    }
    //parses italics last, splitting data at each "*"
    const splitDataEm = newDataStr.split("*");
    let newDataEm = splitDataEm[0];
    let isEm = false;
    //iterates through the split data
    //same formatting rules as 85
    for (i = 1; i < splitDataEm.length; i++) {
        if (isEm) {
            newDataEm += splitDataEm[i];
            isEm = false;
        } else {
            newDataEm += `<em>${splitDataEm[i]}</em>`;
            isEm = true;
        }
    }
    return sanitize(newDataEm, {
        USE_PROFILES: { html: true }, // Do not allow other XML formats (e.g. SVG)
        ALLOWED_TAGS: ["em", "strong"], // Only allow italics and bold tags
        ALLOWED_ATTR: [], // Do not allow any attributes
    });
}
