import React, {Component} from "react";
import {Modal, Table} from 'antd'
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {fetchEnrolled, removeEnrollment} from "../../../actions/application";
import {FiUserMinus} from "react-icons/fi";

const {confirm} = Modal;

export class TableEnrolled extends Component {

    static propTypes = {
        fetchEnrolled: PropTypes.func.isRequired,
        removeEnrollment: PropTypes.func.isRequired,

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
                <a onClick={() => this.doDelete(record)}><FiUserMinus style={IconStyle}/></a>

            ),
        },
    ]

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.fetchEnrolled(this.props.course)
    }

    render() {
        return (
            <div>
                <h4 className="text-center"> Enrolled Students</h4>
                <Table
                    columns={this.column}
                    dataSource={this.props.listEnrolled}
                    size="small"
                    footer={() => <Link to={"/enrollment/enrollUser/" + this.props.course}>Add new student </Link>}

                />
            </div>)


    }

    doDelete(record) {
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
    }

}

const IconStyle = {
    fontSize: '18px',
}

const mapStateToProps = (state) => {

    return {
        listEnrolled: state.enrollment.listEnrolled

    };
};


export default connect(
    mapStateToProps,
    {fetchEnrolled, removeEnrollment})(TableEnrolled);
