import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

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
}));

export default function ButtonAppBar() {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [aboutOpen, setAboutOpen] = React.useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
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
            </Menu>
            <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
        </div>
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
                            href="http://www.mass.gov/covidvaccine"
                            target="_blank"
                            rel="noreferrer"
                        >
                            here
                        </a>
                        .
                    </p>
                    <p>
                        Currently, information is gathered from/for:
                        <ul>
                            <li>maimmunizations.org (many locations)</li>
                            <li>Hannaford (5 locations)</li>
                            <li>UMass Amherst</li>
                            <li>Springfield: Eastfield Mall</li>
                            <li>Danvers: Doubletree Hotel</li>
                            <li>Arlington: Family Practice Group, PC</li>
                        </ul>
                    </p>
                    <p>
                        I'm working as fast as I can to gather more information
                        from other sources. To contact me,{" "}
                        <a href="mailto:macovidvaccines@gmail.com">
                            send an email
                        </a>
                        . I'll try to get back to you but I'm getting a lot of
                        outreach!
                    </p>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}
