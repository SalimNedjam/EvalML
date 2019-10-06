import React, {Component} from "react";
import {Dropdown, Menu, Modal, Select, Table, Tag} from 'antd'
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {
    duplicateChallenge,
    removeChallenge,
    switchGroup,
    switchSubmission,
    switchVisibility
} from "../../../actions/application";
import {FiCopy, FiEdit, FiSettings, FiSliders, FiTrash} from "react-icons/fi";
import {createMessage} from "../../../actions/messages";

const {confirm} = Modal;

export class TableChallenge extends Component {

    static propTypes = {
        removeChallenge: PropTypes.func.isRequired,
        switchVisibility: PropTypes.func.isRequired,

    };
    state = {
        course: -1
    }
    column = [
        {
            title: 'Id',
            dataIndex: 'challenge_id',
            key: 'challenge_id',
        },
        {
            title: 'Titre',
            dataIndex: 'title',
            key: 'title',
        },

        {
            title: 'Status',
            key: 'is_visible',
            render: (text, record) => (
                [
                    <a onClick={() => this.switchStatus(record)} key='1'>
                        {
                            record.is_visible ?
                                <Tag color={'geekblue'}>Published</Tag>
                                :
                                <Tag color={'volcano'}>Unpublished</Tag>}
                    </a>
                    ,
                    <br key='2'/>
                    ,
                    <a onClick={() => this.switchEditGroup(record)} key='3'>
                        {
                            record.enable_edit_group ?
                                <Tag color={'geekblue'}>Groupe: Libre</Tag>
                                :
                                <Tag color={'volcano'}>Groupe: Bloqué</Tag>
                        }
                    </a>
                    ,
                    <br key='4'/>
                    ,
                    <a onClick={() => this.switchSubmissionDelete(record)} key='5'>
                        {
                            record.enable_delete_submission ?
                                <Tag color={'geekblue'}>Soumission: Libre</Tag>
                                :
                                <Tag color={'volcano'}>Soumission: Bloqué</Tag>
                        }
                    </a>
                ]
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Dropdown overlay={this.dropdown(record)} trigger={['click']}>
                    <a className="ant-dropdown-link"><FiSettings/></a>
                </Dropdown>

            ),
        },
    ]

    constructor(props) {
        super(props)
    }

    dropdown(record) {
        return <Menu>
            <Menu.Item key="0">
                <a onClick={() => this.props.history.push("/testSubmission/" + record.challenge_id + "/")}><FiSliders/>{" Tester la soumission"}
                </a>
            </Menu.Item>
            <Menu.Item key="1">
                <a onClick={() => this.props.history.push("/challenge/editChallenge/" + record.challenge_id + "/")}><FiEdit/>{" Edit"}
                </a>
            </Menu.Item>
            <Menu.Item key="2">
                <a onClick={() => this.doDuplicate(record)}><FiCopy/> {" Duplicate"}</a>
            </Menu.Item>
            <Menu.Item key="3">
                <a onClick={() => this.doDelete(record)}><FiTrash/> {" Delete"}</a>
            </Menu.Item>
        </Menu>
    }

    render() {
        const course = this.props.course
        const listChallengeForCourse = this.props.listChallenge.filter(function (challenge) {
            return challenge.course == course;
        })

        return (
            <div>
                <h4 className="text-center">Challenges List</h4>

                <Table
                    columns={this.column}

                    onRow={(record, rowIndex) => {
                        return {
                            onDoubleClick: () => {
                                this.props.history.push("/challengeStaff/" + record.challenge_id + "/")
                            }
                        }
                    }
                    }
                    rowKey='challenge_id'
                    expandedRowRender={challenge => (
                        <div>
                            <strong>Description:</strong>
                            <br/>
                            {challenge.description}
                            <br/>
                            <br/>
                            <strong>Date limite de soumission:</strong>
                            <br/>
                            {new Date(challenge.limitDate).toLocaleString()}
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

                        </div>)
                    }
                    dataSource={listChallengeForCourse}
                    footer={() => <Link to={"/challenge/createChallenge/" + this.props.course}>Add new
                        challenge </Link>}

                />
            </div>)


    }

    doDelete(record) {
        const _this = this;
        confirm({
            title: 'Voulez vous vraiment supprimé ce challenge?',
            content: 'Cette action est définitive!',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.props.removeChallenge(record.challenge_id)

            },
            onCancel() {
            },
        });
    }

    doDuplicate(record) {
        const _this = this;
        confirm({
            title: 'Veuillez selectioner le cours de destination ?',
            content: <div className="form-group">
                <label>Selectioner le cours</label>
                <div>
                    <Select defaultValue={-1} style={{width: 200}} onChange={(value => {
                        _this.setState({course: value})
                    })}>
                        <Select.Option value={-1}/>
                        {_this.renderList()}

                    </Select>
                </div>

            </div>
            ,
            okText: 'Dupliquer',
            okType: 'info',
            cancelText: 'No',
            onOk() {
                if (_this.state.course != -1) {
                    const challenge = {challenge_id: record.challenge_id, course_id: _this.state.course}
                    _this.props.duplicateChallenge(challenge)
                } else
                    _this.props.createMessage({isEmptyTitle: "Veuillez séléctioné une cours"})
            },
            onCancel() {
            },
        });
    }

    onChangeCourse(value) {


        this.setState({
            course: value,
        })


    }

    renderList() {
        return this.props.listCourse.map((course) => {
            return <Select.Option value={course.course_id} key={course.course_id}>{course.description}</Select.Option>
        })
    }

    switchStatus(record) {
        const _this = this;
        confirm({
            title: 'Voulez vous vraiment changé la visibilité ce challenge ?',
            content: record.is_visible ?
                'Le challenge ne serra plus visible par les étudiants !'
                :
                'Le challenge serra visible par les étudiants !',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.props.switchVisibility(record.challenge_id)

            },
            onCancel() {
            },
        });
    }

    switchEditGroup(record) {
        const _this = this;
        confirm({
            title: 'Voulez vous vraiment changé la gestion des groupes ?',
            content: record.is_visible ?
                'Les étudiants ne pourrons plus changer de groupe !'
                :
                'Les étudiants pourrons changer de groupe !',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.props.switchGroup(record.challenge_id)

            },
            onCancel() {
            },
        });
    }

    switchSubmissionDelete(record) {
        const _this = this;
        confirm({
            title: 'Voulez vous vraiment changé la gestion des soumissions ?',
            content: record.is_visible ?
                'Les étudiants ne pourrons plus supprimer des soumissions !'
                :
                'Les étudiants pourrons supprimer des soumissions !',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.props.switchSubmission(record.challenge_id)

            },
            onCancel() {
            },
        });
    }
}

const IconStyle = {
    fontSize: '18px',
    marginRight: '5px'
}
const mapStateToProps = (state) => {

    return {
        listChallenge: state.challenge.listChallenge,
        listCourse: state.course.listCourse

    };
};


export default connect(
    mapStateToProps, {
        createMessage, removeChallenge, switchVisibility, switchGroup, switchSubmission, duplicateChallenge
    }
)(TableChallenge);
