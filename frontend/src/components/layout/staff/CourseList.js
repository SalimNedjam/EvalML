import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {Button, Card, Col, Row} from 'antd'
import {FiChevronRight} from "react-icons/fi";

class CourseList extends Component {
    static propTypes = {
        listCourse: PropTypes.array.isRequired,
        listChallenge: PropTypes.array.isRequired,

    };


    render() {

        return (<div style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
        }}>
            {this.renderHeader()}
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
                style={cardStyle}
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
    renderHeader = () => {
        return (<div>
                <span>
            <span style={{fontSize: 20,}}><b>Cours</b></span>


            <Link style={{float: 'right'}}
                  to={"/courses/createCourse"}>
                <Button type="danger">Ajouter un nouveau cours</Button>

            </Link>
        </span>
                <br/> <br/>
            </div>
        )

    }
}


const cardStyle = {
    width: 300,
    WebkitBoxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    MozBoxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    BoxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',

}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        listCourse: state.course.listCourse,
        listChallenge: state.challenge.listChallenge
    };
};

export default connect(mapStateToProps)(CourseList);
