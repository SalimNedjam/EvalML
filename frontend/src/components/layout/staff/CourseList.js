import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import Row from 'antd/lib/row';
import Card from 'antd/lib/card';
import Col from 'antd/lib/col';
import {FiChevronRight} from "react-icons/fi";

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
                    <Link to={"/courses/" + course.course_id + "/"}><FiChevronRight/></Link>,
                ]}>
                <Card.Meta
                    title={course.description}
                />
                <br/>
                <strong>Nombre de soumission au maximum:</strong>
                <br/>
                {course.nbSubmit === 0 ? "Pas de limite" : course.nbSubmit + " soumissions"}
                <br/>
                <br/>
                <strong>Nombre d'étudiants:</strong>
                <br/>
                {course.nbStudent === 0 ? "Pas de limite" : course.nbStudent + " étudiants"}

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
