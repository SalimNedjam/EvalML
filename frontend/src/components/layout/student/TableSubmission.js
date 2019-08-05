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


    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.fetchSubmission(this.props.challenge)
    }

    render() {
        const sample = this.props.listChallenge.find(chal => chal.challenge_id = this.props.challenge)

        return (
            <div>
                <h4 className="text-center">Submission List</h4>

                <Table
                    dataSource={this.props.listSubmission}
                    footer={() => <Link to={"/submission/" + this.props.challenge + "/"}>New submission </Link>}
                    rowKey='id'
                    expandedRowRender={record => {

                        return <div style={{margin: 0}}>
                            {
                                record.status !== "PENDING" && record.outputs.map(output => {

                                    return <Tag style={{float: 'right', marginRight: 10}}
                                                onClick={() => this.askFile(output.file_id)}>
                                        {output.ext.charAt(0).toUpperCase() + output.ext.slice(1) + " file"}
                                    </Tag>

                                })
                            }


                        </div>
                    }
                    }

                >
                    <Table.ColumnGroup>
                        {
                            sample && sample.scoreKeys.map(scoreKey => {

                                return <Table.Column
                                    title={scoreKey}
                                    key={scoreKey}
                                    render={(text, record) => {
                                        if (record.status == "SUCCESS")
                                            return record.score[0][scoreKey]
                                        return "-"

                                    }


                                    }
                                />
                            })
                        }
                        <Table.Column
                            title='Status'
                            key='status'
                            dataIndex='status'
                            render={status => {

                                if (status == 'PENDING')
                                    return <Tag color={'gold'}>PENDING</Tag>
                                else if (status == 'FAIL')
                                    return <Tag color={'volcano'}>FAIL</Tag>
                                else if (status == 'SUCCESS')
                                    return <Tag color={'green'}>SUCCESS</Tag>
                            }}
                        />
                        <Table.Column
                            title='Tags'
                            key='tags'
                            dataIndex='tags'
                            render={tags => (
                                <span>
                                    {tags.map(tag => (
                                        <Tag color="blue" key={tag}>{tag.toUpperCase()}</Tag>
                                    ))}
                                </span>
                            )}
                        />
                        <Table.Column
                            title='Action'
                            key='action'
                            render={(text, record) => (
                                [<a onClick={() => this.doDelete(record)}><FiTrash style={IconStyle}/></a>]

                            )}
                        />

                    </Table.ColumnGroup>
                </Table>
            </div>
        )


    }

    askFile(file_id) {
        console.log(file_id)
        const token = this.props.auth.token
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        config.headers["Authorization"] = `Token ${token}`;


        axios.get('/api/submission/get_file/?id=' + file_id, config)
            .then(res => {
                console.log(res.data)

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
    return {
        listSubmission: state.submission.listSubmission,
        listChallenge: state.challenge.listChallenge,
        auth: state.auth,

    };
};


export default connect(
    mapStateToProps,
    {fetchSubmission, removeSubmission}
)(TableSubmission);
