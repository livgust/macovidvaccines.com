/*
  Copyright © 2021 Olivia Adams/Ora Innovations LLC. All rights reserved
 */

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import NotificationsDialog from "./NotificationsDialog";
import Toolbar from "@material-ui/core/Toolbar";
import { useTranslation, Trans } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    buttonText: {
        color: theme.palette.primary.contrastText,
    },
    title: {
        flexGrow: 1,
    },
    resourceButton: {
        color: theme.palette.primary,
    },
    unstyledLink: {
        textDecoration: "auto",
        color: "inherit",
    },
}));

export default function ButtonAppBar() {
    const { t } = useTranslation("main");
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [resourcesOpen, setResourcesOpen] = useState(false);
    const [textAlertsOpen, setTextAlertsOpen] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <nav className={classes.root}>
            <AppBar position="fixed" component="div">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Button
                        className={classes.buttonText}
                        href="https://www.gofundme.com/f/wwwmacovidvaccinescom?utm_source=customer&utm_medium=copy_link&utm_campaign=p_cf+share-flow-1"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t("menu.contribute")}
                    </Button>{" "}
                    |
                    <Button
                        className={classes.buttonText}
                        onClick={() => setTextAlertsOpen(true)}
                    >
                        {t("menu.notifications")}
                    </Button>
                </Toolbar>
            </AppBar>
            {/* workaround for spacing - see https://material-ui.com/components/app-bar/#fixed-placement */}
            <Toolbar />
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={() => {
                        handleClose();
                        setAboutOpen(true);
                    }}
                >
                    {t("menu.about")}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        setResourcesOpen(true);
                    }}
                >
                    {t("menu.resources")}
                </MenuItem>
                <MenuItem>
                    <a
                        href={
                            "mailto:macovidvaccines@gmail.com?subject=Site feedback"
                        }
                        className={classes.unstyledLink}
                    >
                        {t("menu.feedback")}
                    </a>
                </MenuItem>
            </Menu>
            <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
            <ResourcesDialog
                open={resourcesOpen}
                onClose={() => setResourcesOpen(false)}
            />
            <NotificationsDialog
                open={textAlertsOpen}
                onClose={() => setTextAlertsOpen(false)}
            />
        </nav>
    );
}

function AboutDialog(props) {
    const { t } = useTranslation("main");
    return (
        <Dialog {...props}>
            <DialogTitle id="about-dialog-title">
                {t("about.title")}
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="about-dialog-description"
                    component="div"
                >
                    <p>
                        <Trans ns="main" i18nKey="about.paragraph1">
                            This website was created by{" "}
                            <a
                                href="http://www.oliviaadams.dev"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Olivia Adams
                            </a>
                            .
                        </Trans>
                    </p>
                    <p>
                        <Trans ns="main" i18nKey="about.paragraph2">
                            This website scrapes data from other websites every
                            minute and tells you what places currently are
                            advertising available appointments for COVID
                            vaccines. It is YOUR responsibility to verify that
                            you are eligible before signing up. For more
                            information, click{" "}
                            <a
                                href="https://www.mass.gov/covidvaccine"
                                target="_blank"
                                rel="noreferrer"
                            >
                                here
                            </a>
                            .
                        </Trans>
                    </p>
                    <p>
                        <Trans ns="main" i18nKey="about.paragraph3">
                            We're working as fast as we can to gather more
                            information from other sources. To contact us,{" "}
                            <a href={"mailto:macovidvaccines@gmail.com"}>
                                send an email
                            </a>
                            .
                        </Trans>
                    </p>
                    <h3>{t("get_involved.title")}</h3>
                    <p>
                        <Trans ns="main" i18nKey="get_involved.paragraph1">
                            If you have experience with designing or developing
                            web site software, and you want to get involved in
                            the site, please{" "}
                            <a
                                href={
                                    "mailto:macovidvaccines@gmail.com?subject=I want to help with MACovidVaccines.com&body=Here's how I can help..."
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                email the team
                            </a>{" "}
                            with a note about how you can contribute.
                        </Trans>
                    </p>
                    <p>
                        <Trans ns="main" i18nKey="get_involved.paragraph2">
                            The website source code can be found on Github. The
                            code that gathers data from other sites is in the{" "}
                            <a
                                href={
                                    "https://github.com/livgust/covid-vaccine-scrapers"
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                covid-vaccine-scrapers
                            </a>{" "}
                            repository. The code that generates the website is
                            in the{" "}
                            <a
                                href={
                                    "https://github.com/livgust/macovidvaccines.com"
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                macovidvaccines.com
                            </a>{" "}
                            repository.
                        </Trans>
                    </p>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

function ResourcesDialog(props) {
    const { t } = useTranslation("main");
    const classes = useStyles();
    return (
        <Dialog {...props}>
            <DialogTitle id="about-dialog-title">
                {t("resources.title")}
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="about-dialog-description"
                    component="div"
                >
                    <Trans ns="main" i18nKey="mass_vax.content">
                        The Commonwealth’s{" "}
                        <a
                            href="https://www.mass.gov/info-details/preregister-for-a-covid-19-vaccine-appointment"
                            rel="noreferrer"
                            target="_blank"
                        >
                            preregistration system
                        </a>{" "}
                        makes it easier to request and schedule an appointment
                        at one of the many mass vaccination locations and
                        regional collaboratives near you. You’ll receive weekly
                        status updates, and you may opt out at any time if you
                        find an appointment elsewhere.
                        <p>
                            We recommend preregistering <i>and</i> using this
                            site. You may find an appointment at locations not
                            covered by preregistration.
                        </p>
                    </Trans>

                    <Button
                        variant="contained"
                        className={classes.resourceButton}
                        href="https://www.mass.gov/info-details/preregister-for-a-covid-19-vaccine-appointment"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t("button.preregister")}
                    </Button>
                    <p>{t("resources.other_sites")}</p>
                    <ul>
                        <li>
                            <Trans ns="main" i18nKey="resources.vaccinate_ma">
                                <a
                                    href="https://vaccinatema.com"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Vaccinate MA
                                </a>{" "}
                                (volunteer-run)
                            </Trans>
                        </li>
                        <li>
                            <Trans ns="main" i18nKey="resources.vaxfinder">
                                <a
                                    href="https://vaxfinder.mass.gov"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Vax Finder
                                </a>{" "}
                                (state-run)
                            </Trans>
                        </li>
                    </ul>
                    <p>
                        <Trans ns="main" i18nKey="resources.more_information">
                            For more information on the vaccine rollout in
                            Massachusetts, visit{" "}
                            <a
                                href="https://www.mass.gov/covid-19-vaccine"
                                target="_blank"
                                rel="noreferrer"
                            >
                                www.mass.gov/covid-19-vaccine
                            </a>
                            .
                        </Trans>
                    </p>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}
