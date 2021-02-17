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
    if (entry.extraData) {
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
                    <b>Address:</b> {entry.streetAddress}, {entry.city}, MA{" "}
                    {entry.zip}
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
            //formats additional information instead of just adding it to the more information section
            if (key === "Additional Information") {
                const currentData = data[key];
                if (currentData) {
                    var finalData = parseMD(currentData);
                    //adds the parsed data as straight html
                    elements.push(
                        <div
                            className={classes.extraData}
                            dangerouslySetInnerHTML={{
                                __html: `<b>${key}:</b> ${finalData}`,
                            }}
                        />
                    );
                }
            } else {
                elements.push(
                    <div className={classes.extraData}>
                        <b>{key}:</b> {data[key]}
                    </div>
                );
            }
        }
        return elements;
    }
}

function parseMD(currentData) {
    //encodes angle brackets to escape data
    let workingData1;
    let workingData2;
    let indexOfLAB = currentData.indexOf("<");
    let indexOfRAB = currentData.indexOf(">");
    if (indexOfLAB !== -1) {
        workingData1 = currentData.replaceAll("<", "&#60;");
    } else {
        workingData1 = currentData;
    }
    if (indexOfRAB !== -1) {
        workingData2 = workingData1.replaceAll(">", "&#62;");
    } else {
        workingData2 = workingData1;
    }
    //parses bold italics first, splitting data at each "***"
    let splitDataEmStr = workingData2.split("***");
    let newDataEmStr = splitDataEmStr[0];
    let isEmStr = false;
    //iterates through the split data
    //uses em to italicize and span with the secondary color for bolding (went with a color change since the titles were bold)
    let i = 0;
    for (i = 1; i < splitDataEmStr.length; i++) {
        if (isEmStr) {
            newDataEmStr = newDataEmStr + "</span></em>" + splitDataEmStr[i];
            isEmStr = false;
        } else {
            newDataEmStr =
                newDataEmStr +
                '<em><span style="color: #F50057">' +
                splitDataEmStr[i];
            isEmStr = true;
        }
    }
    //parses bold next, splitting data at each "**"
    let splitDataStr = newDataEmStr.split("**");
    let newDataStr = splitDataStr[0];
    let isStr = false;
    //iterates through the split data
    //same formatting rules as 85
    for (i = 1; i < splitDataStr.length; i++) {
        if (isStr) {
            newDataStr = newDataStr + "</span>" + splitDataStr[i];
            isStr = false;
        } else {
            newDataStr =
                newDataStr +
                '<span class="formattedExtraData">' +
                splitDataStr[i];
            isStr = true;
        }
    }
    //parses italics last, splitting data at each "*"
    let splitDataEm = newDataStr.split("*");
    let newDataEm = splitDataEm[0];
    let isEm = false;
    //iterates through the split data
    //same formatting rules as 85
    for (i = 1; i < splitDataEm.length; i++) {
        if (isEm) {
            newDataEm = newDataEm + "</em>" + splitDataEm[i];
            isEm = false;
        } else {
            newDataEm = newDataEm + "<em>" + splitDataEm[i];
            isEm = true;
        }
    }
    return newDataEm;
}
