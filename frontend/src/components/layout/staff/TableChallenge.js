import React, {Component} from "react";
import {Modal, Table, Tag} from 'antd'
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {removeChallenge, switchGroup, switchSubmission, switchVisibility} from "../../../actions/application";
import {FiEdit, FiTrash} from "react-icons/fi";

const {confirm} = Modal;

export class TableChallenge extends Component {

    static propTypes = {
        removeChallenge: PropTypes.func.isRequired,
        switchVisibility: PropTypes.func.isRequired,

    };
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
                [<a onClick={() => this.doDelete(record)} key='1'><FiTrash style={IconStyle}/></a>
                    ,
                    <a onClick={() => this.props.history.push("/challenge/editChallenge/" + record.challenge_id + "/")}
                       key='2'>
                        <FiEdit style={IconStyle}/></a>

                ]

            ),
        },
    ]

    constructor(props) {
        super(props)
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
                                this.props.history.push("/challengeGroups/" + record.challenge_id + "/")
                            }
                        }
                    }
                    }
                    rowKey='challenge_id'
                    expandedRowRender={challenge => (
                        <div>
                            <h6>Description: </h6>
                            {challenge.description}
                            <br/>
                            <br/>
                            <h6>Nombre de soumission au maximum: </h6>
                            {challenge.nbSubmit === 0 ? "Pas de limite" : challenge.nbSubmit + " soumissions"}
                            <br/>
                            <br/>
                            <h6>Nombre d'étudiants: </h6>
                            {challenge.nbStudent === 0 ? "Pas de limite" : challenge.nbStudent + " étudiants"}

                        </div>)
                    }
                    dataSource={listChallengeForCourse}
                    footer={() => <Link to={"/challenge/createChallenge"}>Add new challenge </Link>}

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
        listChallenge: state.challenge.listChallenge

    };
};


export default connect(
    mapStateToProps, {removeChallenge, switchVisibility, switchGroup, switchSubmission}
)(TableChallenge);
