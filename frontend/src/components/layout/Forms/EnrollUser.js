import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {clearNonEnrolled, enrollUser, fetchNonEnrolled} from "../../../actions/application";
import {createMessage} from "../../../actions/messages";

export class CreateChallenge extends Component {
    static propTypes = {
        listCourse: PropTypes.array.isRequired,
        listNonEnrolled: PropTypes.array.isRequired,
        fetchNonEnrolled: PropTypes.func.isRequired,
        clearNonEnrolled: PropTypes.func.isRequired,
        enrollUser: PropTypes.func.isRequired,

    };
    state = {
        user: -1,
        course: -1,

    };

    onSubmit = e => {
        e.preventDefault();
        const {user, course} = this.state;

        if (course === "-1" || course === -1)
            this.props.createMessage({selectItem: "Veuiller séléctioner un cours"});
        else if (user === "-1" || user === -1)
            this.props.createMessage({selectItem: "Veuiller séléctioner un étudiant"});
        else {
            const newEnrollment = {user, course}
            this.props.enrollUser(newEnrollment)
        }


    };

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    };

    renderListCourse() {
        return this.props.listCourse.map((course) => {
            return <option value={course.course_id} key={course.course_id}>{course.description}</option>
        })
    }

    renderListStudent() {
        return this.props.listNonEnrolled.map((user) => {
            return <option value={user.user_id} key={user.user_id}>{user.email}</option>
        })
    }

    componentDidMount() {

        const {match = {}} = this.props;
        const course_id = match.params.course_id
        this.setState({
            course: course_id,
            user: -1
        })

        this.props.fetchNonEnrolled(course_id)


    }

    render() {

        const {user, course} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Ajouter un étudiant au cours</h2>

                    <form onSubmit={this.onSubmit}>

                        <div className="form-group">
                            <div className="form-group">
                                <label>Selectioner l'étudiant</label>
                                <select
                                    className="form-control"
                                    name="user"
                                    value={user}
                                    onChange={this.onChange}
                                >
                                    <option value={-1}/>
                                    {this.renderListStudent()}
                                </select>
                            </div>
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


const mapStateToProps = (state) => {
    return {
        listCourse: state.course.listCourse,
        listNonEnrolled: state.enrollment.listNonEnrolled,
    };
};

export default connect(mapStateToProps, {
    enrollUser,
    createMessage,
    clearNonEnrolled,
    fetchNonEnrolled
})(CreateChallenge);
