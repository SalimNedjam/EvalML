import React, {Component} from "react";
import TableEnrolled from "./TableEnrolled";
import {createMessage} from "../../../actions/messages";
import {connect} from 'react-redux'
import {Col, Row} from 'antd'

import TableManagers from "./TableManagers";

import TableChallenge from "./TableChallenge";
import {SendEmail} from "../Forms/SendEmail";

export class Course extends Component {


    render() {
        const {match = {}} = this.props;
        const course = match.params.course;


        const courseObject = this.props.listCourse.filter(function (cours) {
            return cours.course_id == course;
        })[0];
        return (

            <Row type="flex" justify="center" gutter={10} style={{
                margin: '24px 16px',
                padding: 24,
                background: '#fff',
            }}>

                <Col xs={24} sm={26} md={20} lg={14} xl={12}>
                    <TableChallenge course={course} history={this.props.history}/>
                </Col>

                <Col xs={30} sm={26} md={20} lg={14} xl={12}>

                    {courseObject && courseObject.owner === this.props.auth.user.user_id &&
                    <Col>
                        <TableManagers course={course}/>
                    </Col>
                    }
                    <Col style={{marginTop: 30, marginBottom: 10}}>
                        <SendEmail createMessage={this.props.createMessage} course={course}
                                   token={this.props.auth.token}/>
                    </Col>
                    <Col>
                        <TableEnrolled course={course}/>
                    </Col>

                </Col>


            </Row>


        );
    }


}


const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        listCourse: state.course.listCourse,
    };
};

export default connect(
    mapStateToProps,
    {createMessage}
)(Course);
