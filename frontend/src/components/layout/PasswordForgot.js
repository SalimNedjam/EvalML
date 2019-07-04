import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {requestReset} from "../../actions/auth";
import {createMessage} from "../../actions/messages";

export class PasswordForgot extends Component {
    state = {
        email: "",

    };

    static propTypes = {
        requestReset: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    };

    onSubmit = e => {
        e.preventDefault();
        const {email} = this.state;
        const requestReset = {
            email
        }
        this.props.requestReset(requestReset);
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});

    render() {

        const {username} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Reset password</h2>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                onChange={this.onChange}
                                value={username}
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Reset password
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        );
    }
}


export default connect(null, {requestReset, createMessage})(PasswordForgot);
