import React, {Component} from "react";
import {Table} from 'antd'
import {Link} from "react-router-dom";

import axios from 'axios'
import {connect} from 'react-redux';


export class LeaderBoardTable extends Component {

    static propTypes = {};

    state = {
        data: []
    };


    componentDidMount() {
        this.getRanking()

    }


    render() {
        const sample = this.props.listChallenge.find(chal => chal.challenge_id = this.props.challenge)


        return (
            <div>

                <Table
                    className="components-table-demo-nested"
                    rowKey='key'
                    expandedRowRender={record => this.expandedRowRender(record)}
                    dataSource={this.state.data}
                >

                    <Table.ColumnGroup title={<h4 className="text-center">Leaderboard</h4>}>
                        <Table.Column

                            title={'#'}
                            key={'#'}
                            render={(text, record, index) => index + 1}


                        />
                        {
                            sample && sample.scoreKeys.map(scoreKey => {

                                return <Table.Column
                                    defaultSortOrder={'descend'}
                                    sorter={
                                        (a, b) => (a.score[0])[scoreKey] - (b.score[0])[scoreKey]
                                    }
                                    title={scoreKey}
                                    key={scoreKey}
                                    render={(text, record) => {

                                        return (record.score[0])[scoreKey]
                                    }


                                    }
                                />
                            })
                        }


                    </Table.ColumnGroup>
                </Table>
            </div>)


    }

    expandedRowRender = (record) => {
        const columns = [
            {
                title: record.date_submit,
                key: 'email',
                render: (record) => {
                    return <Link
                        to={"/student/" + record.user + "/challenge/" + this.props.challenge}>{record.email} </Link>
                }
            },

        ];

        const data = [];
        record.users.map((user, index) => {
            data.push({
                key: index,
                email: user.email,
                user: user.user_id,
            });
        })
        return <Table columns={columns} dataSource={data} pagination={false}/>;
    };

    getRanking() {
        const token = this.props.auth.token
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        config.headers["Authorization"] = `Token ${token}`;


        axios.get('/api/submission/fetch_rating?challenge_id=' + this.props.challenge, config)
            .then(res => {
                let array = []
                res.data.map((record, index) => {
                    record.key = index + 1
                    array.push(record)
                })
                this.setState({

                    data: array
                })

            }).catch(err => {

        });
    }


}


const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        listChallenge: state.challenge.listChallenge

    };
};

export default connect(mapStateToProps)(LeaderBoardTable);
