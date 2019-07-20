import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {updateInformations, updatePassword} from "../../../actions/auth";
import {createMessage} from "../../../actions/messages";

export class UpdateUser extends Component {
    static propTypes = {
        updatePassword: PropTypes.func.isRequired,
        user: PropTypes.object,
    };
    state = {
        email: this.props.user.username,
        matricule: this.props.user.matricule,
        new_password: "",
        new_password2: "",
        old_password: "",
        last_name: this.props.user.last_name,
        first_name: this.props.user.first_name,
    };

    onSubmitPassword = e => {
        e.preventDefault();
        const {new_password, new_password2, old_password} = this.state;
        if (new_password !== new_password2) {
            this.props.createMessage({passwordNotMatch: "Passwords do not match"});
        } else {
            const updatedUser = {
                new_password,
                old_password
            };
            this.props.updatePassword(updatedUser);
        }
    };

    onSubmitInformations = e => {
        e.preventDefault();
        const {first_name, last_name} = this.state;
        const updatedUser = {
            first_name,
            last_name
        };
        this.props.updateInformations(updatedUser);
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});

    render() {

        const {email, matricule, new_password, new_password2, old_password, first_name, last_name} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Update User</h2>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            disabled={true}
                            value={email}
                        />
                    </div>
                    <div className="form-group">
                        <label>Matricule</label>
                        <input
                            type="text"
                            className="form-control"
                            name="matricule"
                            disabled={true}
                            onChange={this.onChange}
                            value={matricule}
                        />
                    </div>


                    <form onSubmit={this.onSubmitInformations}>
                        <div className="form-group">
                            <label>Prénom</label>
                            <input
                                type="text"
                                className="form-control"
                                name="first_name"
                                onChange={this.onChange}
                                value={first_name}
                            />
                        </div>
                        <div className="form-group">
                            <label>Nom</label>
                            <input
                                type="text"
                                className="form-control"
                                name="last_name"
                                onChange={this.onChange}
                                value={last_name}
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Update Informations
                            </button>
                        </div>

                    </form>


                    <form onSubmit={this.onSubmitPassword}>
                        <div className="form-group">
                            <label>Last password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="old_password"
                                onChange={this.onChange}
                                value={old_password}
                            />
                        </div>
                        <div className="form-group">
                            <label>New password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="new_password"
                                onChange={this.onChange}
                                value={new_password}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm new password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="new_password2"
                                onChange={this.onChange}
                                value={new_password2}
                            />
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Update password
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    console.log(state)
    return {
        user: state.auth.user
    };
};

export default connect(
    mapStateToProps,
    {updatePassword, updateInformations, createMessage}
)(UpdateUser);
