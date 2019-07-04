import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {addManager, clearNonManager, fetchNonManager} from "../../actions/application";
import {createMessage} from "../../actions/messages";

export class CreateChallenge extends Component {
    state = {
        user: -1,
        course: -1,
        is_admin: false

    };

    static propTypes = {
        listCourse: PropTypes.array.isRequired,
        listNonManager: PropTypes.array.isRequired,
        fetchNonManager: PropTypes.func.isRequired,
        clearNonManager: PropTypes.func.isRequired,
        addManager: PropTypes.func.isRequired,

    };


    onSubmit = e => {
        e.preventDefault();
        const {user, course, is_admin} = this.state;

        if (course === "-1" || course === -1)
            this.props.createMessage({selectItem: "Veuiller séléctioner un cours"});
        else if (user === "-1" || user === -1)
            this.props.createMessage({selectItem: "Veuiller séléctioner un membre du staff"});
        else {
            const newManager = {user, course, is_admin}
            this.props.addManager(newManager)
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

    renderListManager() {
        return this.props.listNonManager.map((user) => {
            return <option value={user.user_id} key={user.user_id}>{user.username}</option>
        })
    }

    onChangeCourse = e => {
        console.log((e.target.value))
        this.setState({
            [e.target.name]: e.target.value,
            user: -1
        })

        if (e.target.value === -1 || e.target.value !== "-1") {
            this.props.fetchNonManager(e.target.value)
        } else {
            this.props.clearNonManager()
        }

    }

    render() {

        const {user, course, is_admin} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Ajouter un étudient au cours</h2>

                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <div className="form-group">
                                <label>Selectioner le cours</label>
                                <select
                                    className="form-control"
                                    name="course"
                                    value={course}
                                    onChange={this.onChangeCourse}
                                >
                                    <option value={-1}/>
                                    {this.renderListCourse()}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-group">
                                <label>Selectioner un membre du staff</label>
                                <select
                                    className="form-control"
                                    name="user"
                                    value={user}
                                    onChange={this.onChange}
                                >
                                    <option value={-1}/>
                                    {this.renderListManager()}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">

                            <div className="form-group">
                                <label>Autorisations</label>
                                <select
                                    className="form-control"
                                    name="is_admin"
                                    value={is_admin}
                                    onChange={this.onChange}>
                                    <option value={false}>Accès restreint</option>
                                    <option value={true}>Accès total</option>
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
    console.log(state)
    return {
        listCourse: state.application.listCourse,
        listNonManager: state.application.listNonManager,
    };
};

export default connect(mapStateToProps, {addManager, createMessage, clearNonManager, fetchNonManager})(CreateChallenge);
