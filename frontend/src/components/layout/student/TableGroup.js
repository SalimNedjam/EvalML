import React, {Component} from "react";
import {Modal, Table} from 'antd'
import {Link} from "react-router-dom";

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {createGroup, fetchGroup, removeGroup} from "../../../actions/application";
import {FiStar, FiUserMinus} from "react-icons/fi";

const {confirm} = Modal;

export class TableGroup extends Component {

    static propTypes = {
        fetchGroup: PropTypes.func.isRequired,
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
                if (record.owner == 'true')
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

                if (this.state.user == undefined) {
                    this.setState({
                        user: this.props.listGroup.find(user => this.props.auth.user.email == user.email)
                    })
                }
                if (this.state.user && this.state.user.owner == 'true') {
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
                    rowKey='username'
                    footer={() => this.props.listGroup.length > 0 ? <Link to={"/add_to_group"}>Add new member </Link> :
                        <a href="javascript:;" onClick={() => this.props.createGroup(this.props.challenge)}>Create
                            Group</a>}
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
    {fetchGroup, removeGroup, createGroup}
)(TableGroup);
