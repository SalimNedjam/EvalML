import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {updatePasswordStaff} from "../../../actions/auth";
import {createMessage} from "../../../actions/messages";

export class UpdateStudent extends Component {
    static propTypes = {
        updatePasswordStaff: PropTypes.func.isRequired,
    };
    state = {
        user_id:-1,
        new_password: "",
        new_password2: "",
    };


    onSubmitPassword = e => {
        e.preventDefault();
        const {user_id,new_password, new_password2} = this.state;
        if (new_password !== new_password2) {
            this.props.createMessage({passwordNotMatch: "Passwords do not match"});
        } else {
            const updatedUser = {
                new_password,
                user_id
            };
            this.props.updatePasswordStaff(updatedUser);
        }
    };

    componentDidMount() {
        const {match = {}} = this.props;
        this.setState({
            user_id: match.params.user_id,
        });
    }


    onChange = e => this.setState({[e.target.name]: e.target.value});

    render() {

        const { new_password, new_password2} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Edit password</h2>


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
    return {
        user: state.auth.user
    };
};

export default connect(
    mapStateToProps,
    {updatePasswordStaff, createMessage}
)(UpdateStudent);
