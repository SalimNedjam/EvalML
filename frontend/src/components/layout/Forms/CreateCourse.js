import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {createCourse} from "../../../actions/application";
import {createMessage} from "../../../actions/messages";

export class CreateUser extends Component {
    static propTypes = {
        createCourse: PropTypes.func.isRequired,
    };
    state = {
        description: "",
        nbStudent: "",
        nbSubmit: "",

    };

    onSubmit = e => {
        e.preventDefault();
        const {description, nbStudent, nbSubmit} = this.state;
        const newCourse = {
            description,
            nbStudent,
            nbSubmit,
        }

        this.props.createCourse(newCourse);
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});

    render() {

        const {description, nbStudent, nbSubmit} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Ajouter un cours</h2>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Nom du cours</label>
                            <input
                                type="text"
                                className="form-control"
                                name="description"
                                onChange={this.onChange}
                                value={description}
                            />
                        </div>

                        <div className="form-group">
                            <label>Nombre d'étudiants par groupe (Pas de limite = 0)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="nbStudent"
                                onChange={this.onChange}
                                value={nbStudent}
                            />
                        </div>
                        <div className="form-group">
                            <label>Nombre de soumissions (Pas de limite = 0)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="nbSubmit"
                                onChange={this.onChange}
                                value={nbSubmit}

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


export default connect(null, {createCourse, createMessage})(CreateUser);
