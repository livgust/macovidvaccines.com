import { FilterGroup, FilterSegment } from "./FilterPanel";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import grey from "@material-ui/core/colors/grey";
import PhoneNumber from "./PhoneNumber";
import RadiusFilter from "./FilterPanel/RadiusFilter";
import React, { useState } from "react";
import ZipCodeFilter, { isZipValid } from "./FilterPanel/ZipCodeFilter";

const useStyles = makeStyles((theme) => ({
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
    paddedButton: {
        marginRight: theme.spacing(1),
    },
}));
export default function TextAlertsDialog(props) {
    const classes = useStyles();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [zip, setZip] = useState("");
    const [radius, setRadius] = useState(10);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    return (
        <Dialog
            {...{
                ...props,
                onClose: () => {
                    setSuccess(false);
                    setIsSubmitting(false);
                    setError(false);
                    setPhoneNumber("");
                    setZip("");
                    setRadius(10);
                    props.onClose();
                },
            }}
        >
            <DialogTitle id="about-dialog-title">
                {"Sign Up for Text Notifications"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="about-dialog-description"
                    component="div"
                >
                    <p>
                        Get notifications when appointments become available. By
                        submitting this form, you consent to receiving text
                        messages from us. You can cancel at any time. Standard
                        messaging and data rates may apply. See below for full
                        details.
                    </p>
                    <PhoneNumber
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                    />
                    <br />
                    <br />
                    <FilterGroup name="Get notifications by location">
                        <FilterSegment>
                            <ZipCodeFilter zipCode={zip} onChange={setZip} />
                        </FilterSegment>
                        <FilterSegment>
                            <RadiusFilter
                                variant="notifications"
                                value={radius}
                                onChange={setRadius}
                            />
                        </FilterSegment>
                    </FilterGroup>
                    <br />
                    <Accordion className={classes.accordion}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            classes={{
                                root: classes.accordionSummary,
                                expanded: classes.accordionExpanded,
                            }}
                        >
                            <Typography variant="subtitle1" component="span">
                                Notification details: What to expect
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionDetails}>
                            <p>
                                When we see appointments appear, we will notify
                                subscribers in order of proximity. If 5
                                appointments drop at a local pharmacy, a portion
                                of the nearest subscribers will receive a
                                notification. If 1,000 appointments drop
                                somewhere, everyone will receive a notification
                                as long as the location is within their
                                specified radius. This is due to the cost and
                                computational power needed to send lots of text
                                messages to lots of people. The radius you
                                specify is approximate; we may notify you for a
                                location slightly outside of your radius. You
                                can cancel your subscription at any time by
                                replying STOP.
                            </p>
                            <p>
                                We will never share your phone number with third
                                parties. We may share aggregated, anonymized
                                data with interested parties (for example, what
                                ZIP codes our subscribers entered or how many
                                people have subscribed). Your subscription
                                information will be stored on a secure database.
                            </p>
                            <p>If these terms change, we will notify you.</p>
                        </AccordionDetails>
                    </Accordion>
                    <br />
                    {success && (
                        <Typography>
                            Successfully enrolled in notifications.
                        </Typography>
                    )}
                    {error && (
                        <Typography>
                            An error occurred. Please try again later.
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.paddedButton}
                        disabled={
                            !zip ||
                            !isZipValid(zip) ||
                            !radius ||
                            !phoneNumber ||
                            !(phoneNumber.length === 14) ||
                            isSubmitting ||
                            success
                        }
                        onClick={async () => {
                            setIsSubmitting(true);
                            await addSubscription({
                                phoneNumber,
                                zip,
                                radius,
                            })
                                .then((res) => {
                                    if (
                                        res.statusCode &&
                                        res.statusCode !== 200
                                    ) {
                                        throw new Error(
                                            `${res.code}: ${res.message}`
                                        );
                                    } else {
                                        setSuccess(true);
                                    }
                                })
                                .catch((err) => {
                                    console.error(err);
                                    setError(true);
                                });
                            setIsSubmitting(false);
                        }}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setSuccess(false);
                            setIsSubmitting(false);
                            setError(false);
                            setPhoneNumber("");
                            setZip("");
                            setRadius(10);
                            props.onClose();
                        }}
                    >
                        Cancel
                    </Button>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

async function addSubscription({ phoneNumber, zip, radius }) {
    if (process.env.NODE_ENV !== "production") {
        console.log({
            phoneNumber: phoneNumber.replace(/\D/g, ""),
            zip,
            radius,
        });
        return;
    } else {
        return fetch(
            "https://nhkg3i3jpg.execute-api.us-east-1.amazonaws.com/prod/subscription",
            {
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber.replace(/\D/g, ""),
                    zip,
                    radius,
                }),
                method: "POST",
            }
        ).then((res) => res.json());
    }
}
