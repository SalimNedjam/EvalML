import React, {Component} from "react";
import {Modal, Table} from 'antd'
import {Link} from "react-router-dom";

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {createGroup, fetchGroup, removeGroup,deployGroup} from "../../../actions/application";
import {FiStar, FiUserMinus} from "react-icons/fi";

const {confirm} = Modal;

export class TableGroup extends Component {

    static propTypes = {
        fetchGroup: PropTypes.func.isRequired,
        deployGroup: PropTypes.func.isRequired,
        removeGroup: PropTypes.func.isRequired,

    };
    state = {
        user: undefined
    }
    column = [
        {
            title: '',
            key: 'owner',
            render: record => {
                if (record.owner.toString() == 'true')
                    return <FiStar style={IconStyle}/>
            }
        },
        {
            title: 'Username',
            dataIndex: 'email',
            key: 'Username',

        },
        {
            title: 'First Name',
            dataIndex: 'first_name',

            key: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',

            key: 'last_name',

        },

        {
            title: 'Action',
            key: 'action',
            render: (record) => {
                if (this.props.auth.user.email == record.email)
                    return <a onClick={() => this.doDelete(record)}><FiUserMinus style={IconStyle}/></a>

                const user = this.props.listGroup.find(user => {
                    return this.props.auth.user.email == user.email
                });

                if (user != undefined && user.owner.toString() == 'true') {
                    return <a onClick={() => this.doDelete(record)}><FiUserMinus style={IconStyle}/></a>
                }

            },
        },
    ]

    constructor(props) {
        super(props)
    }

    doDelete(record) {
        const _this = this;
        confirm({
            title: 'Voulez vous vraiment supprimer cet étudiant ?',
            content: record.email + ' ne serra plus dans votre groupe!',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.props.removeGroup(record.id)
            },
            onCancel() {
            },
        });
    }

    componentDidMount() {
        this.props.fetchGroup(this.props.challenge)

    }

    render() {

        return (
            <div>
                <h4 className="text-center">Group Members</h4>
                <Table
                    columns={this.column}
                    dataSource={this.props.listGroup}
                    size="small"
                    rowKey='user'
                    footer={() => <div>
                        {
                            this.props.listGroup.length > 0 ?
                        <Link to={"/add_to_group/" + this.props.challenge}>Add new member </Link> :
                        <a href="javascript:;" onClick={() => this.props.createGroup(this.props.challenge)}>Create
                            Group</a>

                        }
                        <br/><a href="javascript:;" onClick={() => this.props.deployGroup(this.props.challenge)}>
                            Appliquer ce groupe a tous les challenges</a>
                    </div>}
                />
            </div>)


    }


}



const IconStyle = {
    fontSize: '18px',
}

const mapStateToProps = (state) => {

    return {
        auth: state.auth,
        listGroup: state.group.listGroup

    };
};


export default connect(
    mapStateToProps,
    {fetchGroup, removeGroup, createGroup,deployGroup}
)(TableGroup);
