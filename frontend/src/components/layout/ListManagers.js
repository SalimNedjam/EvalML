import React, {Component} from "react";
import {Empty, Icon, Modal, Table} from 'antd'
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {fetchManager, removeManager} from "../../actions/application";

const {confirm} = Modal;

export class ListEnrolled extends Component {

    constructor(props) {
        super(props)
    }

    static propTypes = {
        fetchManager: PropTypes.func.isRequired,
        removeManager: PropTypes.func.isRequired,

    };

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
        return this.props.listManager && this.props.listManager.length > 0 ?
            <Table columns={this.column} dataSource={this.props.listManager} size="small"/>
            :
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
    }

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
                <a onClick={() => this.doDelete(record)}><Icon type="usergroup-delete"/></a>

            ),
        },
    ]


}


const mapStateToProps = (state) => {

    return {
        listManager: state.management.listManager

    };
};


export default connect(
    mapStateToProps,
    {fetchManager, removeManager}
)(ListEnrolled);
