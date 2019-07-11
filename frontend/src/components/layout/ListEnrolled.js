import React, {Component} from "react";
import {Empty, Icon, Modal, Table} from 'antd'
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {fetchEnrolled, removeEnrollment} from "../../actions/application";

const {confirm} = Modal;

export class ListEnrolled extends Component {

    constructor(props) {
        super(props)
    }

    static propTypes = {
        fetchEnrolled: PropTypes.func.isRequired,
        removeEnrollment: PropTypes.func.isRequired,

    };



    componentDidMount() {
        this.props.fetchEnrolled(this.props.course)
    }


    render() {
        return this.props.listEnrolled && this.props.listEnrolled.length > 0 ?
            <Table columns={this.column} dataSource={this.props.listEnrolled} size="small"/>
            :
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
    }

    column = [
    {
        title: 'Id',
        dataIndex: 'user_id',
        key: 'Id',
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
            <a onClick={() => this.doDelete(record)}><Icon type="user-delete"/></a>

        ),
    },
]

    doDelete(record) {
        const _this = this;
        confirm({
            title: 'Voulez vous vraiment désinscrire cet étudiant?',
            content: record.username + ' ne pourra plus voir les challenge du cours !',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.props.removeEnrollment(record.id)

            },
            onCancel() {
            },
        });
    }

}




const mapStateToProps = (state) => {

    return {
        listEnrolled: state.enrollment.listEnrolled

    };
};


export default connect(
    mapStateToProps,
    {fetchEnrolled, removeEnrollment}
)(ListEnrolled);
