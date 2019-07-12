import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {createUser} from "../../../actions/auth";
import {createMessage} from "../../../actions/messages";
import {Select} from 'antd';


export class CreateUser extends Component {
    static propTypes = {
        createUser: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    };
    state = {
        matricule: "",
        username: "",
        listCourseId: [],

    };

    onSubmit = e => {
        e.preventDefault();
        const {matricule, username, listCourseId} = this.state;
        const newUser = {
            matricule,
            username,
            listCourseId
        }
        this.props.createUser(newUser);
    };

    handleChange = (value) => this.setState({listCourseId: value});

    onChange = e => this.setState({[e.target.name]: e.target.value});

    render() {
        const listOptions = [];
        this.props.listCourse.map((course) => {
            listOptions.push(<Select.Option key={course.course_id}>{course.description}</Select.Option>)
        })

        const {matricule, username} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Ajouter un étudiant</h2>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Matricule</label>
                            <input
                                type="text"
                                className="form-control"
                                name="matricule"
                                onChange={this.onChange}
                                value={matricule}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="username"
                                className="form-control"
                                name="username"
                                onChange={this.onChange}
                                value={username}
                            />
                        </div>

                        <div className="form-group">
                            <label>Enrolled Courses</label>
                            <Select
                                mode="multiple"
                                style={{width: '100%'}}
                                placeholder="Please select"
                                defaultValue={[]}
                                onChange={this.handleChange}>
                                {listOptions}
                            </Select>
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
    };
};


export default connect(mapStateToProps, {createUser, createMessage})(CreateUser);
