import React, {Component} from "react";
import {Modal, Table} from 'antd'
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {FiEdit} from "react-icons/fi";

import {fetchAll, fetchEnrolled, removeEnrollment} from "../../../actions/application";
import {FiUserMinus} from "react-icons/fi";

const {confirm} = Modal;

export class TableAllUsers extends Component {

    static propTypes = {
        fetchAll: PropTypes.func.isRequired,

    };
    column = [
        {
            title: 'Id',
            dataIndex: 'user_id',
            key: 'Id',
        },
        {
            title: 'Username',
            dataIndex: 'email',
            key: 'Username',
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
                <Link to={"/updateStudent/"+record.user_id}><FiEdit/></Link>


            ),
        },
    ]

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.fetchAll()
    }

    render() {
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                <h4 className="text-center">All students list</h4>
                <Table
                    columns={this.column}
                    dataSource={this.props.listAll}
                    size="small"

                />
            </div>
            </div>)


    }

    /*doDelete(record) {
        const _this = this;
        confirm({
            title: 'Voulez vous vraiment désinscrire cet étudiant?',
            content: record.email + ' ne pourra plus voir les challenge du cours !',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.props.removeEnrollment(record.id)

            },
            onCancel() {
            },
        });
    }*/

}

const IconStyle = {
    fontSize: '18px',
}

const mapStateToProps = (state) => {

    return {
        listAll: state.enrollment.listAll

    };
};


export default connect(
    mapStateToProps,
    {fetchAll})(TableAllUsers);
