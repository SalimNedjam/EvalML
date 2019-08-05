import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {Button, Card, Col, Dropdown, Menu, Modal, Row} from 'antd'
import {FiChevronRight, FiCopy, FiEdit, FiSettings, FiTrash} from "react-icons/fi";
import {duplicateCourse, editCourse, removeCourse} from "../../../actions/application";

const {confirm} = Modal;

class CourseList extends Component {
    static propTypes = {
        listCourse: PropTypes.array.isRequired,
        listChallenge: PropTypes.array.isRequired,

    };

    dropdown(course) {
        return <Menu>
            <Menu.Item key="0">
                <a onClick={() => this.props.history.push("/courses/editCourse/" + course.course_id + "/")}
                   key='2'>
                    <FiEdit/>{" Edit"}</a>
            </Menu.Item>
            <Menu.Item key="1">
                <a onClick={() => this.doDuplicate(course.course_id)}><FiCopy/> {" Duplicate"}</a>
            </Menu.Item>
            <Menu.Item key="2">
                <a onClick={() => this.doDelete(course.course_id)}><FiTrash/> {" Delete"}</a>
            </Menu.Item>
        </Menu>
    }

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
            return (
                this.renderOne(course)
            )


        })
    }

    doDuplicate(course_id) {
        const _this = this;
        confirm({
            title: 'Voulez vous vraiment dupliquer ce challenge?',
            okText: 'Dupliquer',
            okType: 'info',
            cancelText: 'No',
            onOk() {
                _this.props.duplicateCourse(course_id)

            },
            onCancel() {
            },
        });
    }

    doDelete(course_id) {
        const _this = this;
        confirm({
            title: 'Voulez vous vraiment supprimé ce cours?',
            content: 'Cette action est définitive!',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.props.removeCourse(course_id)

            },
            onCancel() {
            },
        });
    }

    renderOne = (course) => {
        return <Col xs={16} sm={16} md={12} lg={8} xl={8} style={{marginTop: 10}} key={course.course_id}>

            <Card
                title={course.description}
                extra={
                    <Dropdown overlay={this.dropdown(course)} trigger={['click']}>
                        <a className="ant-dropdown-link"><FiSettings/></a>
                    </Dropdown>
                }
                style={cardStyle}
                actions={[
                    <Link to={"/courses/" + course.course_id + "/"}><FiChevronRight/></Link>
                ]}>
                <Card.Meta
                    description={
                        <div>
                            <strong>Nombre de soumission au maximum:</strong>
                            <br/>
                            {course.nbSubmit === 0 ? "Pas de limite" : course.nbSubmit + " soumissions"}
                            <br/>
                            <br/>
                            <strong>Nombre d'étudiants:</strong>
                            <br/>
                            {course.nbStudent === 0 ? "Pas de limite" : course.nbStudent + " étudiants"}

                        </div>
                    }
                />


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
    return {
        listCourse: state.course.listCourse,
        listChallenge: state.challenge.listChallenge
    };
};

export default connect(mapStateToProps, {duplicateCourse, editCourse, removeCourse})(CourseList);
