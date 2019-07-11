import React, {Component, Fragment} from "react";
import {Route, Switch,} from "react-router-dom";
import Alerts from "./layout/Alerts";
import Login from "./layout/Forms/Login";
import PrivateRoute from "./common/PrivateRoute";
import store from "../store";
import {loadUser} from "../actions/auth";
import ChallengeList from "./layout/ChallengeList";
import Headers from "./layout/Header";
import CreateUser from "./layout/Forms/CreateUser";
import UpdateUser from "./layout/Forms/UpdateUser";
import CreateCourse from "./layout/Forms/CreateCourse";
import CreateChallenge from "./layout/Forms/CreateChallenge";
import StaffRoute from "./common/StaffRoute";
import CourseList from "./layout/CourseList";
import EnrollUser from "./layout/Forms/EnrollUser";
import ResetPassword from "./layout/Forms/ResetPassword";
import PasswordForgot from "./layout/Forms/PasswordForgot";
import AddManager from "./layout/Forms/AddManager";
import AddUserGroup from "./layout/Forms/AddUserGroup";
import ListGroup from "./layout/ListGroup";
import Course from "./layout/Course";
import NotFound from "./layout/NotFound";


export default class App extends Component {
    constructor(props) {
        super(props)


    }
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
                        <Route exact path="/login" component={Login}/>
                        <Route path="/password-reset/:token" component={ResetPassword}/>
                        <Route exact path="/password-reset" component={PasswordForgot}/>

                        <PrivateRoute exact path="/add_to_group" component={AddUserGroup}/>
                        <PrivateRoute exact path="/" component={ChallengeList}/>
                        <PrivateRoute exact path="/challenges" component={ChallengeList}/>
                        <PrivateRoute exact path="/updateUser" component={UpdateUser}/>

                        <StaffRoute exact path="/courses" component={CourseList}/>

                        <StaffRoute exact path="/courses/createCourse" component={CreateCourse}/>
                        <StaffRoute exact path="/challenge/createChallenge" component={CreateChallenge}/>
                        <StaffRoute exact path="/register" component={CreateUser}/>
                        <StaffRoute path="/courses/:course" component={Course}/>
                        <StaffRoute exact path="/enrollment/enrollUser" component={EnrollUser}/>
                        <StaffRoute exact path="/management/addManager" component={AddManager}/>

                        <StaffRoute path="/challengeGroups/:challenge" component={ListGroup}/>
                        <Route path="*" component={NotFound}/>


                    </Switch>
                </div>
            </Fragment>
        );
    }
}

