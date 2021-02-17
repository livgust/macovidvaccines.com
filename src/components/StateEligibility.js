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

export default function StateEligibility() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Accordion className={classes.accordion}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Am I eligible?
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                    <Typography>
                        The following groups are currently eligible:
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon />
                            </ListItemIcon>
                            Individuals age 75+
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon />
                            </ListItemIcon>
                            Health care workers doing non-COVID-facing care
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon />
                            </ListItemIcon>
                            Home-based health care workers
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon />
                            </ListItemIcon>
                            Congregate care settings
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon />
                            </ListItemIcon>
                            First responders
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon />
                            </ListItemIcon>
                            Long term care facilities, rest homes and assisted
                            living facilities
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon />
                            </ListItemIcon>
                            Clinical and non-clinical health care workers doing
                            direct and COVID-facing care
                        </ListItem>
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
