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
import Challenge from "./layout/student/Challenge";
import TableGroup from "./layout/staff/TableGroup";
import CreateSubmission from "./layout/Forms/CreateSubmission";
import Course from "./layout/staff/Course";
import NotFound from "./layout/NotFound";


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

                <StudentRoute exact path="/" component={ChallengesList}/>
                <StudentRoute exact path="/add_to_group" component={AddUserGroup}/>


                <StudentRoute exact path="/success_submission" component={SuccessSubmit}/>

                <AdminRoute exact path="/courses/createCourse" component={CreateCourse}/>
                <AdminRoute exact path="/challenge/createChallenge" component={CreateChallenge}/>
                <AdminRoute exact path="/register" component={CreateUser}/>
                <AdminRoute exact path="/management/addManager" component={AddManager}/>


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
                    <span>Ajouter un étudiant</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="3">
                <Link to="/updateUser">
                    <Icon type="profile"/>
                    <span>Profile</span>

                </Link>
            </Menu.Item>
            <Menu.Item key="4" onClick={this.props.logout}>
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
    console.log(state)
    return ({
        auth: state.auth
    })
};

export default connect(
    mapStateToProps,
    {logout}
)(App);


