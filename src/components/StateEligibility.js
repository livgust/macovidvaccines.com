import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PeopleIcon from "@material-ui/icons/People";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    container: {
        marginBottom: theme.spacing(2),
        display: "flex",
        justifyContent: "center",
    },
    accordion: {
        width: "100%",
    },
    accordionDetails: {
        display: "block",
    },
}));

const criteriaGroups = [
    {
        title: null,
        list: [
            [
                "https://www.mass.gov/info-details/covid-19-vaccinations-for-people-ages-65-and-older",
                "Individuals age 65 and older",
            ],
            [
                "https://www.mass.gov/info-details/covid-19-vaccinations-for-individuals-with-certain-medical-conditions",
                "Individuals with two or more of certain medical conditions",
            ],
            [
                "https://www.mass.gov/info-details/covid-19-vaccinations-for-senior-housing-settings",
                "Residents and staff of low-income and affordable senior housing",
            ],
            [
                "https://www.mass.gov/info-details/covid-19-vaccinations-for-people-ages-75-and-older",
                "Individuals age 75 and older",
            ],
            [
                "https://www.mass.gov/info-details/massachusetts-covid-19-vaccination-phases#phase-1-",
                "People in Phase 1 (healthcare, nursing homes, etc.)",
            ],
        ],
    },
    /* TODO - remove the following div after March 11, and update link to be appropriate link from https://www.mass.gov/covid-19-vaccine */
    {
        title: "Eligible to sign up starting March 11: ",
        list: [
            [
                "https://www.mass.gov/news/baker-polito-administration-announces-k-12-educators-child-care-workers-and-k-12-school-staff",
                "K-12 educators, child care workers and K-12 school staff",
            ],
        ],
    },
];

export default function StateEligibility() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Accordion className={classes.accordion}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                                            <br />
                                            <br />
                                            <div>{group.title}</div>
                                            <br />
                                        </>
                                    ) : null}
                                    {group.list.map((criterion, index) => (
                                        <ListItem key={"item" + index}>
                                            <ListItemIcon>
                                                <PeopleIcon />
                                            </ListItemIcon>
                                            <a
                                                href={criterion[0]}
                                                rel="noreferrer"
                                                target="_blank"
                                            >
                                                {criterion[1]}
                                            </a>
                                        </ListItem>
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
