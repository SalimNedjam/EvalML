import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {createMessage} from "../../../actions/messages";
import {createStaff} from "../../../actions/auth";

export class CreateManager extends Component {
    static propTypes = {
        createUser: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    };
    state = {
        email: "",

    };

    onSubmit = e => {
        e.preventDefault();
        const newUser = {
            email: this.state.email,
        }
        this.props.createStaff(newUser);
    };


    onChange = e => this.setState({[e.target.name]: e.target.value});

    render() {

        const {email} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Creation d'un compte Staff</h2>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="prenom.nom@lip6.fr"
                                name="email"
                                onChange={this.onChange}
                                value={email}
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Ajouter
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        );
    }
}


export default connect(null, {createMessage, createStaff})(CreateManager);
