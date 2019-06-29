import React, {Component, Fragment} from "react";
import {Route, Switch,} from "react-router-dom";


import Alerts from "./layout/Alerts";
import Login from "./layout/Login";
import PrivateRoute from "./common/PrivateRoute";

import store from "../store";
import {loadUser} from "../actions/auth";
import ChallengeList from "./layout/ChallengeList";
import Headers from "./layout/Header";
import Register from "./layout/CreateUser";


export default class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser());
    }

    render() {
        return (
            <Fragment>
                <Headers/>
                <Alerts/>
                <div className="container">

                    <Switch>
                        <PrivateRoute exact path="/" component={ChallengeList}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/register" component={Register}/>


                    </Switch>
                </div>
            </Fragment>
        );
    }
}

