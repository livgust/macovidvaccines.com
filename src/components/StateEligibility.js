import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CheckIcon from "@material-ui/icons/Check";
import {makeStyles} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";

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
                <CheckIcon/>
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
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant="subtitle1">
                        Am I eligible to be vaccinated?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                    <List>
                        <EligibilityGroupItem>
                            <a
                                href="https://www.mass.gov/info-details/covid-19-vaccinations-for-people-ages-65-and-older"
                                rel="noreferrer"
                                target="_blank"
                            >Individuals age 65 and older</a>
                        </EligibilityGroupItem>
                        <EligibilityGroupItem>
                            <div>
                                <a
                                    href="https://www.mass.gov/info-details/covid-19-vaccinations-for-individuals-with-certain-medical-conditions"
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    Individuals with two or more of certain medical conditions
                                </a>
                            </div>
                        </EligibilityGroupItem>
                        <EligibilityGroupItem>
                            <a
                                href="https://www.mass.gov/info-details/covid-19-vaccinations-for-senior-housing-settings"
                                rel="noreferrer"
                                target="_blank"
                            >
                                Residents and staff of low-income and affordable senior housing
                            </a>
                        </EligibilityGroupItem>
                        <EligibilityGroupItem>
                            <a
                                href="https://www.mass.gov/info-details/covid-19-vaccinations-for-people-ages-75-and-older"
                                rel="noreferrer"
                                target="_blank"
                            >
                                Individuals age 75 and older
                            </a>
                        </EligibilityGroupItem>
                        <EligibilityGroupItem>
                            <a
                                href="https://www.mass.gov/info-details/massachusetts-covid-19-vaccination-phases#phase-1-"
                                rel="noreferrer"
                                target="_blank"
                            >
                                People in Phase 1 (Health care, nursing homes, etc.)
                            </a>
                        </EligibilityGroupItem>
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
