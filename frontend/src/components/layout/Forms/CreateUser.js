import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {createUser} from "../../../actions/auth";
import {createMessage} from "../../../actions/messages";
import {Checkbox, Select} from 'antd';


export class CreateUser extends Component {
    static propTypes = {
        createUser: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    };
    state = {
        email: "",
        listCourseId: [],
        checkbox: false,

    };

    onSubmit = e => {
        e.preventDefault();
        const {listCourseId} = this.state;

        if (this.state.checkbox) {
            var array = this.state.email.split(";");
            array.map((user) => {
                    const newUser = {
                        email: user,
                        listCourseId
                    }
                    this.props.createUser(newUser);

                }
            )

        } else {
            const newUser = {
                email: this.state.email,
                listCourseId
            }
            this.props.createUser(newUser);

        }
    };

    handleChange = (value) => this.setState({listCourseId: value});

    onChange = e => this.setState({[e.target.name]: e.target.value});
    onChangeCheck = () => this.setState({checkbox: !this.state.checkbox, email: ""});

    render() {
        const listOptions = [];
        this.props.listCourse.map((course) => {
            listOptions.push(<Select.Option key={course.course_id}>{course.description}</Select.Option>)
        })

        const {email, checkbox} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">


                    <h2 className="text-center">Creation de comptes étudiants</h2>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">

                            <Checkbox onClick={this.onChangeCheck}>Insertion multiple</Checkbox>
                        </div>
                        {checkbox === false ?
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="user1@user.com"
                                    name="email"
                                    onChange={this.onChange}
                                    value={email}
                                />
                            </div>
                            :
                            <div className="form-group">
                                <label>Emails separated with ;</label>
                                <textarea
                                    className="form-control"
                                    placeholder="user1@user.com;user2@user.com;user3@user.com;user4@user.com"
                                    name="email"
                                    onChange={this.onChange}
                                    value={email}
                                />
                            </div>}

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
