import React, {Component} from "react";
import {Table} from 'antd'
import axios from 'axios'
import {connect} from 'react-redux';


export class LeaderBoardTable extends Component {

    static propTypes = {};

    state = {
        data: []
    };
    column = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',


        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            render: score => {
                if (score == 0) return "-"
                else return score
            }
        },

    ]

    componentDidMount() {
        this.getRanking()
    }


    render() {
        return (
            <div>
                <h4 className="text-center">Leaderboard</h4>

                <Table
                    className="components-table-demo-nested"
                    columns={this.column}
                    expandedRowRender={record => this.expandedRowRender(record)}
                    dataSource={this.state.data}
                />
            </div>)


    }

    expandedRowRender = (record) => {
        const columns = [
            {title: 'Étudiants', dataIndex: 'username', key: 'username'},

        ];

        const data = [];
        record.users.map((user, index) => {
            data.push({
                key: index,
                username: user.username,
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
            console.log(err.data)
        });
    }


}


const mapStateToProps = (state) => {
    console.log(state)
    return {
        auth: state.auth,

    };
};

export default connect(
    mapStateToProps,
)(LeaderBoardTable);
