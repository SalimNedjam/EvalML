import React, {Component} from "react";
import ListEnrolled from "./ListEnrolled";
import {createMessage} from "../../actions/messages";
import {connect} from 'react-redux'
import {Link} from "react-router-dom";
import {Col, Collapse, Empty, Icon, Row} from 'antd'

import ListManagers from "./ListManagers";


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
                        {this.renderList()}
                    </Col>

                <Col xs={30} sm={26} md={20} lg={14} xl={12}>
                    {courseObject && courseObject.owner === this.props.auth.user.user_id &&

                    <Col>
                        <h4 className="text-center"> Managers List<Link to={"/management/addManager"}>
                            <Icon type="plus"/>
                        </Link></h4>
                        <ListManagers course={course}/>
                    </Col>
                    }
                    <Col>
                        <h4 className="text-center"> Enrolled Students<Link to={"/enrollment/enrollUser"}>
                            <Icon type="plus"/>
                        </Link></h4>
                        <ListEnrolled course={course}/>
                    </Col>
                </Col>


                </Row>


        );
    }

    renderList() {
        const {match = {}} = this.props;
        const course = match.params.course;
        const listChallengeForCourse = this.props.listChallenge.filter(function (challenge) {
            return challenge.course == course;
        })

        return (
            listChallengeForCourse.length > 0 ?
                <div>
                    <h4 className="text-center"> Challenges list <Link to={"/challenge/createChallenge"}>
                        <Icon type="plus"/>
                    </Link></h4>
                    <Collapse
                        bordered={false}
                        defaultActiveKey={['0']}
                        expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0}/>}
                    >
                        {listChallengeForCourse.map((challenge) => {
                                return (
                                    renderOne(challenge)
                                )
                            }
                        )}
                    </Collapse>
                </div>
                :
                <div>
                    <h3 className="text-center"> Challenges list</h3>

                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                </div>)
    }
}

const renderOne = (challenge) => {
    return <Collapse.Panel header={challenge.title} key={challenge.challenge_id} style={customPanelStyle}>
        <div style={styleContainer}>
            <p className="text-center">{challenge.description}</p>
            <Link
                to={"/challengeGroups/" + challenge.challenge_id + "/"}>
                <button
                    className="btn btn-outline-primary text-uppercase text-center"
                    type="button" style={styleButton}>
                    GET GROUPS LIST
                </button>
            </Link>
        </div>
    </Collapse.Panel>
}

const customPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
    fontSize: '20px'

};

const styleButton = {
    fontWeight: "bold",
    fontSize: "14px",
}

const styleContainer = {
    textAlign: "center"
}


const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        listCourse: state.course.listCourse,
        listChallenge: state.challenge.listChallenge
    };
};

export default connect(
    mapStateToProps,
    {createMessage}
)(Course);
