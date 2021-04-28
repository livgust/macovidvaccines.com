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
import { useTranslation, Trans } from "react-i18next";
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
    const { t } = useTranslation("main");
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
                {t("notifications.title")}
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="about-dialog-description"
                    component="div"
                    style={{ color: "black" }}
                >
                    <p>{t("notifications.paragraph1")}</p>
                    <p>
                        <Trans ns="main" i18nKey="notifications.paragraph2">
                            We're funded 100% by donations. Text alerts are a
                            significant expense. If you have the means,{" "}
                            <a
                                href="https://www.gofundme.com/f/wwwmacovidvaccinescom?utm_source=customer&utm_medium=copy_link&utm_campaign=p_cf+share-flow-1"
                                target="_blank"
                                rel="noreferrer"
                            >
                                please consider contributing to this project.
                            </a>
                        </Trans>
                    </p>
                    <br />
                    <PhoneNumber
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                    />
                    <br />
                    <br />
                    <FilterGroup name={t("notifications.filter_name")}>
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
                                {t("notifications.detail_title")}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionDetails}>
                            <Trans
                                ns="main"
                                i18nKey="notifications.detail_content"
                            />
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
                        {t("button.submit")}
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
                        {t("button.cancel")}
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
