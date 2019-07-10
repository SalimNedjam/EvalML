import React, {Component} from "react";
import {Empty, Icon, Table} from 'antd'
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {fetchManager} from "../../actions/application";

export class ListEnrolled extends Component {

    constructor(props) {
        super(props)
    }

    static propTypes = {
        fetchManager: PropTypes.func.isRequired,

    };

    doDelete(enrollementId) {
        console.log(enrollementId + "deleted")
    }

    componentDidMount() {
        this.props.fetchManager(this.props.course)
    }


    render() {
        return this.props.listManager && this.props.listManager.length > 0 ?
            <Table columns={column} dataSource={this.props.listManager} size="small"/>
            :
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
    }


}


const column = [
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
            <a onClick={() => this.doDelete(record.id)}><Icon type="usergroup-delete"/></a>

        ),
    },
]


const mapStateToProps = (state) => {

    return {
        listManager: state.management.listManager

    };
};


export default connect(
    mapStateToProps,
    {fetchManager}
)(ListEnrolled);
