import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CheckIcon from "@material-ui/icons/Check";
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

function EligibilityGroupItem(props) {
    return (
        <ListItem>
            <ListItemIcon>
                <CheckIcon />
            </ListItemIcon>
            {props.children}
        </ListItem>
    );
}

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
                    <Typography>
                        The following groups can make appointments for as early
                        as February 18:
                    </Typography>
                    <List>
                        <EligibilityGroupItem>
                            Individuals age 65+
                        </EligibilityGroupItem>
                        <EligibilityGroupItem>
                            <div>
                                Individuals with two or more of{" "}
                                <a
                                    href="https://www.mass.gov/info-details/certain-medical-conditions-for-phase-2-groups"
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    these
                                </a>{" "}
                                specific medical conditions
                            </div>
                        </EligibilityGroupItem>
                        <EligibilityGroupItem>
                            Residents and staff of low-income and affordable
                            senior housing
                        </EligibilityGroupItem>
                    </List>
                    <Typography>
                        The following groups are currently eligible:
                    </Typography>
                    <List>
                        <EligibilityGroupItem>
                            Individuals age 75+
                        </EligibilityGroupItem>
                        <EligibilityGroupItem>
                            Health care workers doing non-COVID-facing care
                        </EligibilityGroupItem>
                        <EligibilityGroupItem>
                            Home-based health care workers
                        </EligibilityGroupItem>
                        <EligibilityGroupItem>
                            Congregate care settings
                        </EligibilityGroupItem>
                        <EligibilityGroupItem>
                            First responders
                        </EligibilityGroupItem>
                        <EligibilityGroupItem>
                            Long term care facilities, rest homes and assisted
                            living facilities
                        </EligibilityGroupItem>
                        <EligibilityGroupItem>
                            Clinical and non-clinical health care workers doing
                            direct and COVID-facing care
                        </EligibilityGroupItem>
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
