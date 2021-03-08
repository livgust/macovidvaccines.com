import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PeopleIcon from "@material-ui/icons/People";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";

const useStyles = makeStyles((theme) => ({
    container: {
        marginBottom: theme.spacing(1),
        display: "flex",
        justifyContent: "center",
    },
    accordion: {
        width: "100%",
    },
    accordionDetails: {
        display: "block",
        paddingTop: 0,
        paddingBottom: theme.spacing(1),
    },
    accordionSummary: {
        backgroundColor: grey[100],
        content: {
            margin: 0,
        },
    },
    accordionExpanded: {
        backgroundColor: grey[300],
    },
    listGroup: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
    },
    listItem: {
        padding: 0, // theme.spacing(0),
    },
}));

const criteriaGroups = [
    {
        title:
            "You may click the links below for official criteria from Massachusetts:",
        list: [
            // NOTE: the link is applied to the section of text in the [square brackets]
            {
                link:
                    "https://www.mass.gov/info-details/covid-19-vaccinations-for-people-ages-65-and-older",
                text: "Individuals [age 65 and older]",
                color: "primary",
            },
            {
                link:
                    "https://www.mass.gov/info-details/covid-19-vaccinations-for-individuals-with-certain-medical-conditions",
                text:
                    "Individuals with [two or more of certain medical conditions]",
                color: "primary",
            },

            {
                link:
                    "https://www.mass.gov/info-details/covid-19-vaccinations-for-senior-housing-settings",
                text:
                    "Residents and staff of [low-income and affordable senior housing]",
                color: "primary",
            },

            {
                link:
                    "https://www.mass.gov/info-details/covid-19-vaccinations-for-people-ages-75-and-older",
                text: "Individuals [age 75 and older]",
                color: "primary",
            },

            {
                link:
                    "https://www.mass.gov/info-details/massachusetts-covid-19-vaccination-phases#phase-1-",
                text: "People in [Phase 1] (healthcare, nursing homes, etc.)",
                color: "primary",
            },
        ],
    },
    /* TODO - remove the following div after March 11, and update link to be appropriate link from https://www.mass.gov/covid-19-vaccine */
    {
        title: "Eligible to sign up starting March 11: ",
        list: [
            {
                link:
                    "https://www.mass.gov/news/baker-polito-administration-announces-k-12-educators-child-care-workers-and-k-12-school-staff",
                text:
                    "[K-12 educators, child care workers and K-12 school staff]",
                color: "disabled",
            },
        ],
    },
];

export default function StateEligibility() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Accordion className={classes.accordion}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    classes={{
                        root: classes.accordionSummary,
                        expanded: classes.accordionExpanded,
                    }}
                >
                    <Typography variant="subtitle1">
                        Am I eligible to be vaccinated?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                    <List>
                        {criteriaGroups.map((group, index) => {
                            return (
                                // https://reactjs.org/docs/reconciliation.html#recursing-on-children
                                // "The key only has to be unique among its siblings, not globally unique"
                                // However the interaction with fragments is unclear, so ensure
                                // title fragments and listitems are unique, as they are siblings.
                                <React.Fragment key={"title" + index}>
                                    {group.title ? (
                                        // We don't display a title for the first
                                        // group, for some reason...
                                        <>
                                            <div className={classes.listGroup}>
                                                <Typography variant="subtitle2">
                                                    {group.title}
                                                </Typography>
                                            </div>
                                        </>
                                    ) : null}
                                    {group.list.map((criterion, index) => (
                                        <CriterionItem
                                            criterion={criterion}
                                            index={index}
                                            classes={classes}
                                        />
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

function CriterionItem({ index, criterion, classes }) {
    // parse criterion text into 3 parts, where the section
    // between square brackets is the linkable text
    // "Part-1 [Part-2] Part-3
    const regex = /([^[]*)\[([^\]]*)](.*)/;
    const parts = criterion.text.match(regex);

    return (
        <ListItem key={"item" + index} className={classes.listItem}>
            <ListItemIcon>
                <PeopleIcon color={criterion.color} />
            </ListItemIcon>
            <ListItemText>
                <Typography>
                    {!parts ? (
                        criterion.text
                    ) : (
                        <>
                            {parts[1]}
                            <Link
                                href={criterion.link}
                                rel="noreferrer"
                                target="_blank"
                            >
                                {parts[2]}
                            </Link>
                            {parts[3]}
                        </>
                    )}
                </Typography>
            </ListItemText>
        </ListItem>
    );
}
