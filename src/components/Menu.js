/*
  Copyright © 2021 Olivia Adams/Ora Innovations LLC. All rights reserved
 */

import React from "react";
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
import Toolbar from "@material-ui/core/Toolbar";

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
    unstyledLink: {
        textDecoration: "auto",
        color: "inherit",
    },
}));

export default function ButtonAppBar() {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [aboutOpen, setAboutOpen] = React.useState(false);
    const [resourcesOpen, setResourcesOpen] = React.useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <nav className={classes.root}>
            <AppBar position="static" component="div">
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
                        Contribute
                    </Button>
                </Toolbar>
            </AppBar>
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
                    About
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        setResourcesOpen(true);
                    }}
                >
                    Resources
                </MenuItem>
                <MenuItem>
                    <a
                        href={"mailto:macovidvaccines@gmail.com?subject=Site feedback"}
                        className={classes.unstyledLink}
                    >
                        Give feedback
                    </a>
                </MenuItem>
            </Menu>
            <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
            <ResourcesDialog
                open={resourcesOpen}
                onClose={() => setResourcesOpen(false)}
            />
        </nav>
    );
}

function AboutDialog(props) {
    return (
        <Dialog {...props}>
            <DialogTitle id="about-dialog-title">
                {"About this Website"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="about-dialog-description">
                    <p>
                        This website was created by{" "}
                        <a
                            href="http://www.oliviaadams.dev"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Olivia Adams
                        </a>
                        .
                    </p>
                    <p>
                        This website scrapes data from other websites every 5
                        minutes and tells you what places currently are
                        advertising available appointments for COVID vaccines.
                        It is YOUR responsibility to verify that you are
                        eligible before signing up. For more information, click{" "}
                        <a
                            href="https://www.mass.gov/covidvaccine"
                            target="_blank"
                            rel="noreferrer"
                        >
                            here
                        </a>
                        .
                    </p>
                    <p>
                        We're working as fast as we can to gather more
                        information from other sources. To contact us,{" "}
                        <a href={"mailto:macovidvaccines@gmail.com"}>
                            send an email
                        </a>
                        .
                    </p>
                    <h3>Get Involved</h3>
                    <p>
                        If you have experience with designing or developing web site software, and you want to get
                        involved in the site, please
                        <a href={
                            "mailto:macovidvaccines@gmail.com?subject=I want to help with MACovidVaccines.com&body=Here's how I can help..."
                            }
                            target="_blank"
                            rel="noreferrer"
                        >{" "}
                        email the team
                        </a> with a note about how you can contribute.
                    </p>
                    <p>
                        The website source code can be found on Github. The code
                        that gathers data from other sites is in the{" "}
                        <a
                            href={
                                "https://github.com/livgust/covid-vaccine-scrapers"
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            covid-vaccine-scrapers
                        </a>{" "}
                        repository. The code that generates the website is in
                        the{" "}
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
                    </p>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

function ResourcesDialog(props) {
    return (
        <Dialog {...props}>
            <DialogTitle id="about-dialog-title">{"Resources"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="about-dialog-description">
                    <p>
                        There are two other websites for the state of
                        Massachusetts that compile information on vaccine
                        availability. They are:
                        <ul>
                            <li>
                                <a
                                    href="https://vaccinatema.com"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Vaccinate MA
                                </a>{" "}
                                (volunteer-run)
                            </li>
                            <li>
                                <a
                                    href="https://vaxfinder.mass.gov"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Vax Finder
                                </a>{" "}
                                (state-run)
                            </li>
                        </ul>
                    </p>
                    <p>
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
                    </p>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}
