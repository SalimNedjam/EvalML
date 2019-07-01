import React, {Component, Fragment} from "react";
import {Route, Switch,} from "react-router-dom";


import Alerts from "./layout/Alerts";
import Login from "./layout/Login";
import PrivateRoute from "./common/PrivateRoute";

import store from "../store";
import {loadUser} from "../actions/auth";
import ChallengeList from "./layout/ChallengeList";
import Headers from "./layout/Header";
import CreateUser from "./layout/CreateUser";
import UpdateUser from "./layout/UpdateUser";
import CreateCourse from "./layout/CreateCourse";
import CreateChallenge from "./layout/CreateChallenge";


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
                        <PrivateRoute exact path="/register" component={CreateUser}/>
                        <PrivateRoute exact path="/challenges" component={ChallengeList}/>
                        <PrivateRoute exact path="/updateprofile" component={UpdateUser}/>
                        <PrivateRoute exact path="/createCourse" component={CreateCourse}/>
                        <PrivateRoute exact path="/createChallenge" component={CreateChallenge}/>


                    </Switch>
                </div>
            </Fragment>
        );
    }
}

