import React, {Component} from "react";
import TableEnrolled from "./TableEnrolled";
import {createMessage} from "../../../actions/messages";
import {connect} from 'react-redux'
import {Col, Row} from 'antd'

import TableManagers from "./TableManagers";

import TableChallenge from "./TableChallenge";

export class Course extends Component {


    render() {
        const {match = {}} = this.props;
        const course = match.params.course;


        const courseObject = this.props.listCourse.filter(function (cours) {
            return cours.course_id == course;
        })[0];
        return (

            <Row type="flex" justify="center" gutter={10}>

                <Col xs={24} sm={26} md={20} lg={14} xl={12}>
                    <TableChallenge course={course} history={this.props.history}/>
                </Col>

                <Col xs={30} sm={26} md={20} lg={14} xl={12}>
                    {courseObject && courseObject.owner === this.props.auth.user.user_id &&
                    <Col>
                        <TableManagers course={course}/>
                    </Col>
                    }
                    <Col>
                        <TableEnrolled course={course}/>
                    </Col>
                </Col>


            </Row>


        );
    }


}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        auth: state.auth,
        listCourse: state.course.listCourse,
    };
};

export default connect(
    mapStateToProps,
    {createMessage}
)(Course);
