import React, {Component} from "react";
import {Modal, Table, Tag} from 'antd'
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {removeChallenge, switchVisibility} from "../../../actions/application";
import {FiDownloadCloud, FiTrash, FiUploadCloud} from "react-icons/fi";

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
            dataIndex: 'is_visible',
            render: is_visible => (
                is_visible ?
                    <Tag color={'geekblue'}>Published</Tag>
                    :
                    <Tag color={'volcano'}>Unpublished</Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                [<a onClick={() => this.doDelete(record)}><FiTrash style={IconStyle}/></a>
                    ,
                    <a onClick={() => this.switchStatus(record)}>{record.is_visible ?
                        <FiDownloadCloud style={IconStyle}/> : <FiUploadCloud style={IconStyle}/>}</a>
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
const cardStyle = {
    WebkitBoxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    MozBoxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    BoxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',

}

export default connect(
    mapStateToProps, {removeChallenge, switchVisibility}
)(TableChallenge);
