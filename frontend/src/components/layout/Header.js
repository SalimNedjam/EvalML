import React, {Component} from "react";
import {Link, NavLink} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {logout} from "../../actions/auth";
import {Navbar, NavbarBrand} from 'shards-react';


class Header extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired
    };

    render() {
        const {isAuthenticated, user} = this.props.auth;
        const authLinks = (
            <div>
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                   aria-expanded="false"> <span className="caret">Profile</span></a>

                <form className="dropdown-menu dropdown-menu-right">
                    <Link to="/updateUser" className="dropdown-item">Profile</Link>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" onClick={this.props.logout} href="#">Logout</a>
                </form>
            </div>
        );

        const guestLinks = (

            <Link to="/login" className="nav-item ml-auto mr-1">Login</Link>
        );

        const guestNav = (


            <nav className="navbar navbar-expand-sm bg-dark navbar-dark justify-content-end">
                <Link className="navbar-brand" to="/">Home</Link>
                {isAuthenticated ? authLinks : guestLinks}
            </nav>
        );


        const userNav = (
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
                <a className="navbar-brand" href="#">User Navbar</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03"
                        aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="collapse navbar-collapse" id="navbarColor03">
                    <ul className="navbar-nav mr-auto">
                        <NavLink exact to="/" className="nav-link">Home</NavLink>
                        <NavLink to="/challenges" className="nav-link">Challenges</NavLink>
                        <NavLink to="/add_to_group" className="nav-link">Add User to group</NavLink>

                    </ul>

                </div>
                {isAuthenticated ? authLinks : guestLinks}

            </nav>
        );


        const staffNav = (
            <Navbar type="dark" theme="secondary" expand="md">
                <NavbarBrand href="#">Shards React</NavbarBrand>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03"
                        aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="collapse navbar-collapse" id="navbarColor03">
                    <ul className="navbar-nav mr-auto">
                        <NavLink exact to="/" className="nav-link">Home</NavLink>
                        <NavLink to="/courses" className="nav-link">Courses</NavLink>
                    </ul>
                    {isAuthenticated ? authLinks : guestLinks}
                </div>

            </Navbar>
        );


        const adminNav = (
            <Navbar type="dark" theme="secondary" expand="md">
                <NavbarBrand href="#">Shards React</NavbarBrand>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03"
                        aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="collapse navbar-collapse" id="navbarColor03">
                    <ul className="navbar-nav mr-auto">
                        <NavLink exact to="/" className="nav-link">Home</NavLink>
                        <NavLink to="/courses" className="nav-link">Courses</NavLink>
                        <NavLink to="/register" className="nav-link">Add User</NavLink>


                    </ul>
                    {isAuthenticated ? authLinks : guestLinks}
                </div>

            </Navbar>
        );


        return (
            isAuthenticated !== null ?
                (isAuthenticated === true ?
                    (user.is_staff === true ?
                        (user.is_admin === true ?
                            adminNav
                            :
                            staffNav)
                        :
                        userNav)
                    :
                    guestNav)
                :
                null
        )

    }

}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {logout}
)(Header);
