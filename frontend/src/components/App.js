import React, {Component} from "react";
import store from "../store";

import {Link, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import {loadUser, logout} from "../actions/auth";
import {Icon, Layout, Menu} from 'antd';
import Alerts from "./layout/Alerts";
import Login from "./layout/Forms/Login";
import ResetPassword from "./layout/Forms/ResetPassword";
import PasswordForgot from "./layout/Forms/PasswordForgot";
import AuthRoute from "./common/AuthRoute";
import UpdateUser from "./layout/Forms/UpdateUser";
import StudentRoute from "./common/StudentRoute";
import ChallengesList from "./layout/student/ChallengesList";
import AddUserGroup from "./layout/Forms/AddUserGroup";
import SuccessSubmit from "./layout/student/SuccessSubmit";
import AdminRoute from "./common/AdminRoute";
import CreateCourse from "./layout/Forms/CreateCourse";
import CreateChallenge from "./layout/Forms/CreateChallenge";
import CreateUser from "./layout/Forms/CreateUser";
import AddManager from "./layout/Forms/AddManager";
import StaffRoute from "./common/StaffRoute";
import CourseList from "./layout/staff/CourseList";
import EnrollUser from "./layout/Forms/EnrollUser";
import CreateSubmission from "./layout/Forms/CreateSubmission";
import Course from "./layout/staff/Course";
import NotFound from "./layout/NotFound";
import EditChallenge from "./layout/Forms/EditChallenge";
import ForceAddUserGroup from "./layout/Forms/ForceAddUserGroup";
import CreateManager from "./layout/Forms/CreateManager";
import EditCourse from "./layout/Forms/EditCourse";
import ChallengeStaff from "./layout/staff/ChallengeStaff";
import Challenge from "./layout/student/Challenge";
import {StudentChallengeDetail} from "./layout/staff/StudentChallengeDetail";
import TestSubmission from "./layout/staff/TestSubmission";
import TableAllUsers from "./layout/staff/TableAllUsers";
import UpdateStudent from "./layout/staff/UpdateStudent";


export class App extends Component {
    state = {
        collapsed: false,
    };

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        store.dispatch(loadUser());

    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    routes = () => (<div>
        <Alerts/>
        <div className="container">
            <Switch>
                <Route exact path="/login" component={Login}/>
                <Route path="/password-reset/:token" component={ResetPassword}/>
                <Route exact path="/password-reset" component={PasswordForgot}/>

                <AuthRoute exact path="/updateUser" component={UpdateUser}/>
                <StaffRoute exact path="/updateStudent/:user_id" component={UpdateStudent}/>

                <StudentRoute exact path="/" component={ChallengesList}/>
                <StudentRoute exact path="/add_to_group/:challenge_id" component={AddUserGroup}/>

                <StaffRoute path="/group/force_add_to_group/:challenge_id/:group_id" component={ForceAddUserGroup}/>
                <StaffRoute path="/showAllStudents" component={TableAllUsers}/>


                <StudentRoute exact path="/success_submission" component={SuccessSubmit}/>

                <AdminRoute exact path="/courses/createCourse" component={CreateCourse}/>
                <AdminRoute path="/courses/editCourse/:course_id" component={EditCourse}/>

                <AdminRoute exact path="/challenge/createChallenge/:course_id" component={CreateChallenge}/>
                <AdminRoute exact path="/register" component={CreateUser}/>
                <AdminRoute exact path="/createStaff" component={CreateManager}/>

                <AdminRoute exact path="/management/addManager/:course_id" component={AddManager}/>


                <StaffRoute exact path="/courses" component={CourseList}/>

                <StaffRoute exact path="/enrollment/enrollUser/:course_id" component={EnrollUser}/>
                <StaffRoute path="/challenge/editChallenge/:challenge" component={EditChallenge}/>
                <StudentRoute path="/challenge/:challenge" component={Challenge}/>
                <StaffRoute path="/student/:user/challenge/:challenge" component={StudentChallengeDetail}/>

                <StaffRoute path="/challengeStaff/:challenge" component={ChallengeStaff}/>
                <StudentRoute path="/submission/:challenge" component={CreateSubmission}/>
                <StaffRoute path="/testSubmission/:challenge" component={TestSubmission}/>

                <Route path="/password-reset/:token" component={ResetPassword}/>
                <StaffRoute path="/courses/:course" component={Course}/>


                <Route component={NotFound}/>

            </Switch>
        </div>
    </div>)
    adminNav = () => (
        <Menu theme="light" defaultSelectedKeys={['0']} mode="inline">
            <Menu.Item key="1">
                <Link to="/courses">
                    <Icon type="book"/>
                    <span>Cours</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="2">
                <Link to="/register">
                    <Icon type="user-add"/>
                    <span>Création d'étudiant</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="3">
                <Link to="/createStaff">
                    <Icon type="user-add"/>
                    <span>Création de staff</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="4">
                <Link to="/showAllStudents">
                    <Icon type="unordered-list" />
                <span>Étudiants inscrits</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="5">
                <Link to="/updateUser">
                    <Icon type="profile"/>
                    <span>Profile</span>

                </Link>
            </Menu.Item>
            <Menu.Item key="6" onClick={this.props.logout}>
                <Icon type="logout"/>
                <span>Se déconnecter</span>
            </Menu.Item>

        </Menu>

    )
    staffNav = () => (
        <Menu theme="light" defaultSelectedKeys={['0']} mode="inline">
            <Menu.Item key="1">
                <Link to="/courses">
                    <Icon type="book"/>
                    <span>Cours</span>

                </Link>

            </Menu.Item>
            <Menu.Item key="2">
                <Link to="/updateUser">
                    <Icon type="profile"/>
                    <span>Profile</span>

                </Link>
            </Menu.Item>
            <Menu.Item key="3" onClick={this.props.logout}>
                <Icon type="logout"/>
                <span>Se déconnecter</span>
            </Menu.Item>
        </Menu>

    )
    studentNav = () => (
        <Menu theme="light" defaultSelectedKeys={['0']} mode="inline">

            <Menu.Item key="1">
                <Link to="/">
                    <Icon type="book"/>
                    <span>Cours</span>

                </Link>

            </Menu.Item>
            <Menu.Item key="2">
                <Link to="/updateUser">
                    <Icon type="profile"/>
                    <span>Profile</span>

                </Link>
            </Menu.Item>
            <Menu.Item key="3" onClick={this.props.logout}>
                <Icon type="logout"/>
                <span>Se déconnecter</span>
            </Menu.Item>

        </Menu>

    )

    render() {
        const {isAuthenticated, user} = this.props.auth;


        if (isAuthenticated !== null && !isAuthenticated)
            return this.routes();

        return (
            <Layout style={{height: '100vh'}}>
                <Layout.Sider theme="light" collapsible collapsed={this.state.collapsed} onCollapse={this.toggle}>

                    {
                        isAuthenticated !== null ?
                            (isAuthenticated === true ?
                                (user.is_staff === true ?
                                    (user.is_admin === true ?
                                        this.adminNav()
                                        :
                                        this.staffNav())
                                    :
                                    this.studentNav())
                                :
                                null)
                            :
                            null
                    }


                </Layout.Sider>
                <Layout>
                    <Layout.Content>
                        {this.routes()}
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    }


}

const mapStateToProps = state => {
    return ({
        auth: state.auth
    })
};

export default connect(
    mapStateToProps,
    {logout}
)(App);


