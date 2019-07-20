import React, {Component} from "react";
import {Modal, Table} from 'antd'
import {Link} from "react-router-dom";

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {fetchManager, removeManager} from "../../../actions/application";
import {FiUserMinus} from "react-icons/fi";

const {confirm} = Modal;

export class TableManagers extends Component {

    static propTypes = {
        fetchManager: PropTypes.func.isRequired,
        removeManager: PropTypes.func.isRequired,

    };
    column = [
        {
            title: 'Id',
            dataIndex: 'user_id',
            key: 'Id'
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'Username',

        },
        {
            title: 'Matricule',
            dataIndex: 'matricule',
            key: 'Matricule',
        },
        {
            title: 'Course permissions',
            dataIndex: 'is_course_admin',
            key: 'Course permissions',

        },
        {
            title: 'Group permissions',
            dataIndex: 'is_group_admin',
            key: 'Group permissions',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <a onClick={() => this.doDelete(record)}><FiUserMinus style={IconStyle}/></a>

            ),
        },
    ]

    constructor(props) {
        super(props)
    }

    doDelete(record) {
        const _this = this;
        confirm({
            title: 'Voulez vous vraiment supprimer ce manager ?',
            content: record.username + ' ne pourra plus gérer ce cours !',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.props.removeManager(record.id)
            },
            onCancel() {
            },
        });
    }

    componentDidMount() {
        this.props.fetchManager(this.props.course)

    }

    render() {
        return (
            <div>
                <h4 className="text-center"> Managers List</h4>
                <Table
                    columns={this.column}
                    dataSource={this.props.listManager}
                    size="small"
                    footer={() => <Link to={"/management/addManager"}>Add new manager </Link>}

                />
            </div>)


    }


}


const IconStyle = {
    fontSize: '18px',
}

const mapStateToProps = (state) => {

    return {
        listManager: state.management.listManager

    };
};


export default connect(
    mapStateToProps,
    {fetchManager, removeManager}
)(TableManagers);
