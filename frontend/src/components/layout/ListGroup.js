import React, {Component} from "react";
import {connect} from 'react-redux'
import {Card, CardBody, Col, Row} from "shards-react";
import {createMessage} from "../../actions/messages";
import axios from 'axios'

export class ListGroup extends Component {

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
        return this.state.listGroups.map(group => {
            return (
                <Row>
                    <Col>
                        <Card small className="mb-4">
                            <CardBody className="p-0 pb-3">
                                <table className="table mb-0">
                                    <thead className="bg-light">
                                    {header_table}
                                    </thead>
                                    <tbody>
                                    {group.map(user => {
                                        console.log(user)
                                        return this.renderUser(user)
                                    })}
                                    </tbody>
                                </table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

            )
        })
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

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
};

export default connect(
    mapStateToProps,
    {createMessage}
)(ListGroup);
