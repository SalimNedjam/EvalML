import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {Card, Col, Icon, Row} from 'antd';

class CourseList extends Component {
    static propTypes = {
        listCourse: PropTypes.array.isRequired,
        listChallenge: PropTypes.array.isRequired,

    };


    render() {

        return (<div>

            <div>


                <Link
                    to={"/courses/createCourse"}>
                    <button
                        className="btn btn-outline-primary text-uppercase text-center"
                        type="button">
                        Create a course
                    </button>
                </Link>
            </div>
            <Row gutter={16}>
                {this.renderList()}
            </Row>

        </div>)
    };


    renderList() {
        return this.props.listCourse.map((course) => {
            console.log(course)
            return (
                this.renderOne(course)
            )


        })
    }

    renderOne = (course) => {
        return <Col xs={16} sm={16} md={12} lg={8} xl={8} style={{marginTop: 10}} key={course.course_id}>
            <Card
                style={{width: 300}}
                actions={[
                    <Link to={"/courses/" + course.course_id + "/"}><Icon type="arrow-right"/></Link>,
                ]}>
                <Card.Meta
                    title={course.description}
                />
                <br/>
                <strong>Fréquence de soumission:</strong>
                <br/>
                {course.freqSubmit === 0 ? "Pas de limite" : "Chaque " + course.freqSubmit + " minute(s)"}
                <br/>
                <br/>
                <strong>Nombre de soumission au maximum:</strong>
                <br/>
                {course.freqSubmit === 0 ? "Pas de limite" : course.freqSubmit + " soumissions"}
                <br/>
                <br/>
                <strong>Nombre d'étudiants:</strong>
                <br/>
                {course.freqSubmit === 0 ? "Pas de limite" : course.freqSubmit + " étudiants"}

            </Card>
        </Col>
    }
}


const mapStateToProps = (state) => {
    console.log(state)
    return {
        listCourse: state.course.listCourse,
        listChallenge: state.challenge.listChallenge
    };
};

export default connect(mapStateToProps)(CourseList);
