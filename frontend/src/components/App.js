import React, {Component, Fragment} from "react";
import {Route, Switch} from "react-router-dom";
import Alerts from "./layout/Alerts";
import Login from "./layout/Forms/Login";
import StudentRoute from "./common/StudentRoute";
import store from "../store";
import {loadUser} from "../actions/auth";
import ChallengesList from "./layout/student/ChallengesList";
import Headers from "./layout/Header";
import CreateUser from "./layout/Forms/CreateUser";
import UpdateUser from "./layout/Forms/UpdateUser";
import CreateCourse from "./layout/Forms/CreateCourse";
import CreateChallenge from "./layout/Forms/CreateChallenge";
import StaffRoute from "./common/StaffRoute";
import CourseList from "./layout/staff/CourseList";
import EnrollUser from "./layout/Forms/EnrollUser";
import ResetPassword from "./layout/Forms/ResetPassword";
import PasswordForgot from "./layout/Forms/PasswordForgot";
import AddManager from "./layout/Forms/AddManager";
import AddUserGroup from "./layout/Forms/AddUserGroup";
import TableGroup from "./layout/staff/TableGroup";
import Course from "./layout/staff/Course";
import NotFound from "./layout/NotFound";
import Void from "./layout/Void";
import AdminRoute from "./common/AdminRoute";
import AuthRoute from "./common/AuthRoute";
import CreateSubmission from "./layout/Forms/CreateSubmission";
import SuccessSubmit from "./layout/student/SuccessSubmit";
import Challenge from "./layout/student/Challenge";


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

                        <AuthRoute exact path="/updateUser" component={UpdateUser}/>

                        <StudentRoute exact path="/" component={ChallengesList}/>
                        <StudentRoute exact path="/add_to_group" component={AddUserGroup}/>

                        
                        <StudentRoute exact path="/success_submission" component={SuccessSubmit}/>

                        <AdminRoute exact path="/courses/createCourse" component={CreateCourse}/>
                        <AdminRoute exact path="/challenge/createChallenge" component={CreateChallenge}/>
                        <AdminRoute exact path="/register" component={CreateUser}/>
                        <AdminRoute exact path="/management/addManager" component={AddManager}/>


                        <StaffRoute exact path="/" component={Void}/>
                        <StaffRoute exact path="/courses" component={CourseList}/>
                        <StaffRoute exact path="/enrollment/enrollUser" component={EnrollUser}/>

                        <StudentRoute path="/challenge/:challenge" component={Challenge}/>
                        <StaffRoute path="/challengeGroups/:challenge" component={TableGroup}/>
                        <StudentRoute path="/submission/:challenge" component={CreateSubmission}/>
                        <Route path="/password-reset/:token" component={ResetPassword}/>
                        <StaffRoute path="/courses/:course" component={Course}/>


                        <Route path="*" component={NotFound}/>

                    </Switch>
                </div>
            </Fragment>
        );
    }
}

