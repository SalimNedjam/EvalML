import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {editCourse} from "../../../actions/application";
import {createMessage} from "../../../actions/messages";

export class CreateUser extends Component {
    static propTypes = {
        editCourse: PropTypes.func.isRequired,
    };
    state = {
        description: "",
        nbStudent: "",
        nbSubmit: "",

    };

    onSubmit = e => {
        e.preventDefault();
	const {match={}} = this.props;
	const course_id=match.params.course_id
        const {description, nbStudent, nbSubmit} = this.state;
        const editedCourse = {description,nbStudent, nbSubmit,course_id}

        this.props.editCourse(editedCourse);
    };

    componentDidMount() {
        const {match = {}} = this.props;
        const course_id = match.params.course_id
        const course = this.props.listCourse.find(course => course.course_id = course_id)
        if (course != undefined)
            this.setState({
                description: course.description,
                nbStudent: course.nbStudent,
                nbSubmit: course.nbSubmit,
            })

    }

    onChange = e => this.setState({[e.target.name]: e.target.value});

    render() {

        const {description, nbStudent, nbSubmit} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Modification ddu cours</h2>
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
                                Modifier
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
        listCourse: state.course.listCourse,
    };
};


export default connect(mapStateToProps, {editCourse, createMessage})(CreateUser);
