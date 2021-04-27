import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import App from "./App";
import About from "./About";

export default function AppRouter() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/">
                        <App />
                    </Route>
                    <Route
                        path="/zip/:ZIPCode"
                        render={({ match }) => (
                            <App zipParam={match.params.ZIPCode} />
                        )}
                    />
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route>
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
