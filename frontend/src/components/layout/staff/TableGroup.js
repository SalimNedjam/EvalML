import React, {Component} from "react";
import {connect} from 'react-redux'
import {Col, Empty, Row, Table} from 'antd'
import {createMessage} from "../../../actions/messages";
import axios from 'axios'
import {reduceObjValues} from "../../../actions/application";
import {FiUserMinus} from "react-icons/fi";

export class TableGroup extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listGroups: []
        }

    }

    componentDidMount() {
        const {match = {}} = this.props;
        const challenge = match.params.challenge;
        const token = this.props.auth.token
        console.log(token)
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        config.headers["Authorization"] = `Token ${token}`;


        axios.get('api/group/list_groups_challenge?challenge=' + challenge, config)
            .then(res => {
                let groups = {};
                res.data.forEach(function (item) {
                    let list = groups[item.group_id];
                    if (list) {
                        list.push(item);
                    } else {
                        groups[item.group_id] = [item];
                    }
                });

                this.setState({
                    listGroups: Object.values(groups)

                })
            }).catch(err => {
            console.log(err.data)
        })


    }

    renderUser(user) {
        return (
            <tr>
                <td>{user.user.user_id}</td>
                <td>{user.user.username}</td>
                <td>{user.user.matricule}</td>
                <td>{user.user.first_name}</td>
                <td>{user.user.last_name}</td>
            </tr>)
    }

    render() {
        return <div>
            {this.iterateGroup()}
        </div>
    }

    iterateGroup() {
        console.log("HERE")
        return this.state.listGroups.length > 0 ?
            this.state.listGroups.map(group => {
                let array = []
                group.map((manager, index) => {
                    let obj = reduceObjValues(manager)
                    obj.key = index
                    array.push(obj)
                });
                return (
                    <Row>
                        <Col>

                            <Table columns={column} dataSource={array} size="small"/>

                        </Col>
                    </Row>

                )
            }) :
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>


    }

}

export const header_table = (<tr>
    <th scope="col" className="border-0">
        id
    </th>
    <th scope="col" className="border-0">
        Email
    </th>
    <th scope="col" className="border-0">
        Matricule
    </th>
    <th scope="col" className="border-0">
        First Name
    </th>
    <th scope="col" className="border-0">
        Last Name
    </th>
</tr>)


const column = [
    {
        title: 'Id',
        dataIndex: 'user_id',
        key: 'Id',
    },
    {
        title: 'Email',
        dataIndex: 'username',
        key: 'Username',
    },
    {
        title: 'Matricule',
        dataIndex: 'matricule',
        key: 'Matricule',
    },
    {
        title: 'Last Name',
        dataIndex: 'last_name',
        key: 'last_name',
    },
    {
        title: 'First Name',
        dataIndex: 'first_name',
        key: 'first_name',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <a onClick={() => this.doDelete(record.id)}><FiUserMinus/></a>

        ),
    },
]


const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
};

export default connect(
    mapStateToProps,
    {createMessage}
)(TableGroup);
