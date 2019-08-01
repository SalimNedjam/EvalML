import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {Card, Col, Row} from 'antd';
import {FiChevronRight} from "react-icons/fi";

class ChallengesList extends Component {
    static propTypes = {
        listChallenge: PropTypes.array.isRequired,

    };


    render() {

        return (

            this.props.listCourse.map(course=>{
            let array=this.props.listChallenge.filter(chal => chal.course==course.course_id
            )
            return <Row gutter={16} style={{
                margin: '24px 16px',
                padding: 24,
                background: '#fff',
            }}>
                <h5>{course.description}</h5>
                {
                array.map((challenge) => {
                    return (
                        this.renderOne(challenge)
                    )
                })}
            </Row>
            })

        )
    };




    renderOne = (challenge) => {
        return <Col xs={16} sm={16} md={12} lg={8} xl={8} style={{marginTop: 10}} key={challenge.challenge_id}>
            <Card
                style={{width: 300}}
                actions={[
                    <Link to={"/challenge/" + challenge.challenge_id + "/"}><FiChevronRight/></Link>,
                ]}>
                <Card.Meta
                    title={challenge.title}
                />
                <br/>
                <strong>Description:</strong>
                <br/>
                {challenge.description}
                <br/>
                <br/>
                <strong>Nombre de soumission au maximum:</strong>
                <br/>
                {challenge.nbSubmit === 0 ? "Pas de limite" : challenge.nbSubmit + " soumissions"}
                <br/>
                <br/>
                <strong>Nombre d'étudiants:</strong>
                <br/>
                {challenge.nbStudent === 0 ? "Pas de limite" : challenge.nbStudent + " étudiants"}

            </Card>
        </Col>
    }
}


const mapStateToProps = (state) => {
    return {
        listChallenge: state.challenge.listChallenge,
        listCourse:state.course.listCourse
    };
};

export default connect(mapStateToProps)(ChallengesList);
