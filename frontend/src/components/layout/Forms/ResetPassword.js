import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import PropTypes from "prop-types";
import {resetPassword} from "../../../actions/auth";
import {createMessage} from "../../../actions/messages";
import {Button, Result} from 'antd'

export class ResetPassword extends Component {
    static propTypes = {
        resetPassword: PropTypes.func.isRequired,
        done: PropTypes.bool.isRequired,

    };
    state = {
        new_password: "",
        new_password2: "",
    };

    onSubmitPassword = e => {
        e.preventDefault();
        const {new_password, new_password2} = this.state;
        const {match = {}} = this.props;

        if (new_password !== new_password2) {
            this.props.createMessage({passwordNotMatch: "Passwords do not match"});
        } else {
            const password = new_password;
            const token = match.params.token;

            this.props.resetPassword(password, token);
        }
    };


    onChange = e => this.setState({[e.target.name]: e.target.value});

    render() {
        const {new_password, new_password2} = this.state;
        if (this.props.done === true) {
            return <Result
                status="success"
                title="Your password has been sucessfully reset !"
                extra={[
                    <Link to='/login'>
                        <Button type="primary" key="console">
                            Login
                        </Button>
                    </Link>,
                ]}
            />
        }
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Password Reset</h2>
                    <form onSubmit={this.onSubmitPassword}>
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
    return {done: state.auth.done}

};

export default connect(
    mapStateToProps,
    {resetPassword, createMessage}
)(ResetPassword);
