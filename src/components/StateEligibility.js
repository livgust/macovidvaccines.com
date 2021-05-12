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

const EDT = "-04:00";
//const EST="-05:00";

const eligibilityNow = new Date();
// Key Dates (provided for testing purposes
//const eligibilityNow = new Date(`2021-03-22T00:00:00${EDT}`);
//const eligibilityNow = new Date(`2021-04-05T00:00:00${EDT}`);
//const eligibilityNow = new Date(`2021-04-19T00:00:00${EDT}`);

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
        padding: 0,
    },
    listItemIcon: {
        "min-width": theme.spacing(5),
    },
}));

// NOTE: the link is applied to the section of text in the [square brackets]
const criteriaGroups = [
    {
        // This group is the only group after April 19th as
        // everyone in the Commonwealth will be eligible.
        startDate: `2021-04-19T00:00:00${EDT}`,
        title: "[Official criteria from Massachusetts]",
        link: "https://www.mass.gov/covid-19-vaccine",
        list: [
            {
                text:
                    "All individuals ages 12-17 can receive the Pfizer vaccine.",
                color: "primary",
            },
            {
                text:
                    "All individuals ages 18 and older can receive any vaccine.",
                color: "primary",
            },
        ],
    },
];

export default function StateEligibility() {
    const classes = useStyles();

    // filter out entire groups that have ended
    const filteredGroups = criteriaGroups.filter((group) => {
        return !(
            (group.startDate && eligibilityNow < new Date(group.startDate)) ||
            (group.endDate && eligibilityNow >= new Date(group.endDate))
        );
    });

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
                    <Typography variant="subtitle1" component="span">
                        Am I eligible to be vaccinated?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                    <List>
                        {filteredGroups.map((group, index) => {
                            return (
                                // https://reactjs.org/docs/reconciliation.html#recursing-on-children
                                // "The key only has to be unique among its siblings, not globally unique"
                                // However the interaction with fragments is unclear, so ensure
                                // title fragments and listitems are unique, as they are siblings.
                                <React.Fragment key={"title" + index}>
                                    {group.title ? (
                                        // We don't display a title for the first
                                        // group, for some reason...
                                        <CriterionGroup
                                            className={classes.listGroup}
                                            group={group}
                                        />
                                    ) : null}
                                    {group.list.map((criterion, index) => (
                                        <CriterionItem
                                            criterion={criterion}
                                            key={"criterion" + index}
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

function CriterionGroup({ className, group }) {
    return (
        <div className={className}>
            <MarkupLink
                text={group.title}
                link={group.link}
                variant="subtitle2"
            />
        </div>
    );
}

function CriterionItem({ criterion, classes }) {
    // skip any criteria that aren't in the valid time window
    if (
        (criterion.startDate &&
            eligibilityNow < new Date(criterion.startDate)) ||
        (criterion.endDate && eligibilityNow >= new Date(criterion.endDate))
    ) {
        return false;
    }

    return (
        <ListItem className={classes.listItem}>
            <ListItemIcon className={classes.listItemIcon}>
                <PeopleIcon color={criterion.color} />
            </ListItemIcon>
            <ListItemText>
                <MarkupLink link={criterion.link} text={criterion.text} />
            </ListItemText>
        </ListItem>
    );
}

/*
 * @param {string} text
 * @param {string} link
 * @param {string} variant
 */
function MarkupLink({ text, link, variant }) {
    /* 
    Parse criterion text into 3 parts, where the section
    between square brackets is the linkable text
    "Part-1 [Part-2] Part-3
     */
    const regex = /([^[]*)\[([^\]]*)](.*)/;
    const parts = text.match(regex);

    return (
        <Typography variant={variant}>
            {!parts ? (
                text
            ) : (
                <>
                    {parts[1]}
                    <Link href={link} rel="noreferrer" target="_blank">
                        {parts[2]}
                    </Link>
                    {parts[3]}
                </>
            )}
        </Typography>
    );
}
