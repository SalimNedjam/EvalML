import React, {Component} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {logout} from "../../actions/auth";


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

                <form className="dropdown-menu dropdown-menu-right" style={{"margin-right": "10px"}}>
                    <a className="dropdown-item" href="#">My profile</a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" onClick={this.props.logout} href="#">Logout</a>
                </form>
            </div>
        );


        const guestLinks = (
            <Link to="/login" className="nav-link">Login</Link>
        );


        return (<nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">Navbar</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03"
                    aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor03">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Challenges</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Stats</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">About</a>
                    </li>
                </ul>

            </div>
            {isAuthenticated ? authLinks : guestLinks}

        </nav>)

    }

}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {logout}
)(Header);
