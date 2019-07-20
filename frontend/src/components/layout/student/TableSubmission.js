import React, {Component} from "react";
import {Modal, Table, Tag} from 'antd'
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {fetchSubmission} from "../../../actions/application";
import {FiTrash} from "react-icons/fi";

const {confirm} = Modal;

export class TableSubmission extends Component {

    static propTypes = {};
    column = [

        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            render: score => {
                if (score == 0) return "-"
                else return score
            }
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: status => {

                if (status == 'PENDING')
                    return <Tag color={'gold'}>PENDING</Tag>
                else if (status == 'FAIL')
                    return <Tag color={'volcano'}>FAIL</Tag>
                else if (status == 'SUCCESS')
                    return <Tag color={'green'}>SUCCESS</Tag>
            },
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: tags => (
                <span>
                {tags.map(tag => {
                    return (
                        <Tag color={'geekblue'} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
              </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                [<a onClick={() => this.doDelete(record)}><FiTrash style={IconStyle}/></a>]

            ),
        },
    ]

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.props.fetchSubmission(this.props.challenge)
    }

    render() {
        return (
            <div>
                <h4 className="text-center">Submission List</h4>

                <Table
                    columns={this.column}
                    dataSource={this.props.listSubmission}
                    footer={() => <Link to={"/submission/" + this.props.challenge + "/"}>New submission </Link>}
                    rowKey='id'

                />
            </div>)


    }

    doDelete(record) {
        const _this = this;
        confirm({
            title: 'Voulez vous vraiment supprimé cette soumission?',
            content: 'Cette action est définitive!',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {

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
        listSubmission: state.submission.listSubmission

    };
};


export default connect(
    mapStateToProps,
    {fetchSubmission}
)(TableSubmission);
