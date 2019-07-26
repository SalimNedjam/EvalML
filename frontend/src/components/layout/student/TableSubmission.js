import React, {Component} from "react";
import {Modal, Table, Tag} from 'antd'
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {fetchSubmission, removeSubmission} from "../../../actions/application";
import {FiTrash} from "react-icons/fi";
import axios from 'axios'

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
            {tags.map(tag => (
                <Tag color="blue" key={tag}>{tag.toUpperCase()}</Tag>
            ))}
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
                    expandedRowRender={record => (
                        <div style={{margin: 0}}>
                            {record.status !== "PENDING" && record.outputs.map(output => (
                                <Tag
                                    onClick={() => this.askFile(output.file_id)}>
                                    {output.ext.charAt(0).toUpperCase() + output.ext.slice(1) + " file"}
                                </Tag>

                            ))}
                        </div>
                    )}

                />
            </div>)


    }

    askFile(file_id) {
        const token = this.props.auth.token
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        config.headers["Authorization"] = `Token ${token}`;


        axios.get('api/submission/get_file/?id=' + file_id, config)
            .then(res => {
                let fileName = res.headers["content-disposition"].split("filename=")[1];
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName); //or any other extension
                document.body.appendChild(link);
                link.click();
            }).catch(err => {
            console.log(err.data)
        })
    }

    doDelete(record) {
        const _this = this;
        console.log(record)
        confirm({
            title: 'Voulez vous vraiment supprimé cette soumission?',
            content: 'Cette action est définitive!',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.props.removeSubmission(record.id)

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
    console.log(state.submission.listSubmission)
    return {
        listSubmission: state.submission.listSubmission,
        auth: state.auth,

    };
};


export default connect(
    mapStateToProps,
    {fetchSubmission, removeSubmission}
)(TableSubmission);
