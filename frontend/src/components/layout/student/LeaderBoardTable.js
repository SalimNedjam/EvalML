import React, {Component} from "react";
import {Table} from 'antd'
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
        console.log(this.state.data);
        const sample = this.state.data[0]

        return (
            <div>
                <h4 className="text-center">Leaderboard</h4>

                <Table
                    className="components-table-demo-nested"
                    rowKey='key'
                    expandedRowRender={record => this.expandedRowRender(record)}
                    dataSource={this.state.data}
                >

                    <Table.ColumnGroup>
                        <Table.Column

                            title={'#'}
                            key={'#'}
                            render={(text, record, index) => index + 1}


                        />
                        {
                            sample && Object.entries(sample.score[0]).map(score => {

                                return <Table.Column
                                    defaultSortOrder={'descend'}
                                    sorter={
                                        (a, b) => (a.score[0])[score[0]] - (b.score[0])[score[0]]
                                    }
                                    title={score[0]}
                                    key={score[0]}
                                    render={(text, record) => {

                                        return (record.score[0])[score[0]]
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
            {title: 'Étudiants', dataIndex: 'email', key: 'email'},

        ];

        const data = [];
        record.users.map((user, index) => {
            data.push({
                key: index,
                email: user.email,
            });
        })
        return <Table columns={columns} dataSource={data} pagination={false}/>;
    };

    getRanking() {
        const token = this.props.token;
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

    };
};

export default connect(
    mapStateToProps,
)(LeaderBoardTable);
