/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import Button from "@material-ui/core/Button";
import Copyright from "./components/Copyright";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import Menu from "./components/Menu";
import React from "react";
import themeTemplate from "./theme";
import {
    createMuiTheme,
    makeStyles,
    MuiThemeProvider,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import DialogContentText from "@material-ui/core/DialogContentText";

const theme = createMuiTheme(themeTemplate);

const useStyles = makeStyles((theme) => ({
    main: {
        padding: theme.spacing(2),
    },
    aboutContent: {
        borderWidth: 0,
        borderBottomWidth: "1px",
        borderStyle: "solid",
        borderColor: "#cccccc",
        paddingBottom: theme.spacing(2),
        "& h3": {
            marginTop: theme.spacing(3),
            marginBottom: -theme.spacing(2),
        },
    },
    heading: {
        "text-align": "center",
        marginTop: -theme.spacing(1),
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        maxWidth: "700px",
        /*
        [theme.breakpoints.up("md")]: {
            width: `calc(100% - ${theme.drawerWidth}px)`,
            marginLeft: theme.drawerWidth,
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
        },
*/
    },
}));

function About() {
    return (
        <MuiThemeProvider theme={theme}>
            <Menu />
            <MainComponent />
        </MuiThemeProvider>
    );
}

function MainComponent() {
    const { t } = useTranslation("main");
    const classes = useStyles();

    return (
        <main className={classes.main}>
            <Grid container justify="center" spacing={3}>
                <Grid container id="main-container" justify="center">
                    <Grid className={classes.content}>
                        <h1 className={classes.heading}>{t("about_us")}</h1>
                        <AboutContent className={classes.aboutContent} />
                        <Copyright />
                    </Grid>
                </Grid>
            </Grid>
        </main>
    );
}

function AboutContent({ className }) {
    return (
        <DialogContentText className={className}>
            <Button variant="contained" color="primary" component={Link} to="/">
                Find Vaccination Appointments
            </Button>
            <p>
                <a
                    href="http://www.oliviaadams.dev"
                    target="_blank"
                    rel="noreferrer"
                >
                    Olivia Adams
                </a>{" "}
                created the <Link to="/">macovidvaccines.com</Link> website to
                make it easier for people to find COVID-19 vaccination
                appointments in Massachusetts. The site collects information
                from vaccination sites across the Commonwealth and presents them
                in an easy-to-use format, showing how many appointments each
                location has.
            </p>
            <p>
                There's now a team of software engineers and designers working
                with her, volunteering their time.
            </p>
            <p>
                Olivia and the website have been featured in local and national
                news, including{" "}
                <a
                    href="https://www.cnn.com/2021/02/08/us/olivia-adams-ma-covid-vaccine-website-trnd/index.html"
                    target="_blank"
                    rel="noreferrer"
                >
                    CNN
                </a>
                ,{" "}
                <a
                    href="https://www.wbur.org/commonhealth/2021/02/06/olivia-adams-develops-simpler-mass-vaccine-website"
                    target="_blank"
                    rel="noreferrer"
                >
                    WBUR-FM CommonHealth
                </a>
                ,{" "}
                <a
                    href="https://alumni.cornell.edu/article/cornellians-website-streamlines-the-vaccine-appointment-process/"
                    target="_blank"
                    rel="noreferrer"
                >
                    Cornell Alumni News
                </a>
                ,
                <a
                    href="https://www.healthcareitnews.com/news/athenahealth-developer-creates-covid-19-vaccine-website-maternity-leave"
                    target="_blank"
                    rel="noreferrer"
                >
                    Healthcare IT News
                </a>
                , and{" "}
                <a
                    href="https://www.nbcboston.com/news/coronavirus/creator-of-simpler-mass-vaccine-sign-up-website-gets-meeting-with-baker-admin/2297442/"
                    target="_blank"
                    rel="noreferrer"
                >
                    NBC Boston
                </a>
                .
            </p>

            <h3>Want to help?</h3>
            <p>
                Support this work by{" "}
                <a
                    href="https://www.gofundme.com/f/wwwmacovidvaccinescom?utm_source=customer&utm_medium=copy_link&utm_campaign=p_cf+share-flow-1"
                    target="_blank"
                    rel="noreferrer"
                >
                    making a contribution
                </a>
                . If you have questions, or want to get involved,{" "}
                <a
                    href={
                        "mailto:macovidvaccines@gmail.com?subject=site feeedback"
                    }
                >
                    send an email send Olivia email
                </a>
                .
            </p>

            {/*            https://www.cnn.com/videos/health/2021/02/08/software-developer-builds-simple-massachusetts-covid-19-vaccine-website-olivia-adams-intv-newday-vpx.cnn*/}

            <h3>Technical details</h3>
            <p>
                This website scrapes data from other websites every minute and
                shows locations that are currently advertising available
                appointments for COVID vaccinations. It is your responsibility
                to{" "}
                <a
                    href="https://www.mass.gov/covid-19-vaccine"
                    target="_blank"
                    rel="noreferrer"
                >
                    verify that you are eligible
                </a>{" "}
                before signing up.
            </p>

            <p>
                We're working as fast as we can to gather more information from
                other sources.
            </p>

            <p>
                The website source code can be found on Github: The code that
                gathers data from other sites is in the{" "}
                <a
                    href="https://github.com/livgust/covid-vaccine-scrapers"
                    target="_blank"
                    rel="noreferrer"
                >
                    covid-vaccine-scrapers
                </a>{" "}
                repository. The code that generates the website is in the{" "}
                <a
                    href="https://github.com/livgust/macovidvaccines.com"
                    target="_blank"
                    rel="noreferrer"
                >
                    macovidvaccines.com repository
                </a>
                .
            </p>

            <h3>Resources</h3>
            <p>
                The Commonwealth's{" "}
                <a
                    href="https://www.mass.gov/info-details/preregister-for-a-covid-19-vaccine-appointment"
                    target="_blank"
                    rel="noreferrer"
                >
                    preregistration system
                </a>{" "}
                helps you get an appointment at one of the seven mass
                vaccination locations. You'll receive weekly status updates, and
                you may opt out at any time if you find an appointment
                elsewhere.
            </p>

            <p>
                We recommend preregistering and using this site — you may find
                an appointment at locations not covered by preregistration.
            </p>

            <p>
                There are two other websites for the state of Massachusetts that
                compile information on vaccine availability. They are:
                <ul>
                    <li>
                        <a
                            href="https://vaccinatema.com/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Vaccinate MA
                        </a>{" "}
                        (volunteer-run)
                    </li>
                    <li>
                        <a
                            href="https://vaxfinder.mass.gov/"
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
                For more information on the vaccine rollout in Massachusetts,
                visit{" "}
                <a
                    href="https://www.mass.gov/covid-19-vaccine"
                    target="_blank"
                    rel="noreferrer"
                >
                    www.mass.gov/covid-19-vaccine
                </a>
                .
            </p>
            <Button variant="contained" color="primary" component={Link} to="/">
                Find Vaccination Appointments
            </Button>
        </DialogContentText>
    );
}

export default About;
