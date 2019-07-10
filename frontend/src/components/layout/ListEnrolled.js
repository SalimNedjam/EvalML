import React, {Component} from "react";
import {Empty, Icon, Table} from 'antd'
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {fetchEnrolled} from "../../actions/application";

export class ListEnrolled extends Component {

    constructor(props) {
        super(props)
    }

    static propTypes = {
        fetchEnrolled: PropTypes.func.isRequired,

    };

    doDelete(enrollementId) {
        console.log(enrollementId + "deleted")
    }

    componentDidMount() {
        this.props.fetchEnrolled(this.props.course)
    }


    render() {
        return this.props.listEnrolled && this.props.listEnrolled.length > 0 ?
            <Table columns={column} dataSource={this.props.listEnrolled} size="small"/>
            :
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
    }


}


const column = [
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
            <a onClick={() => this.doDelete(record.id)}><Icon type="user-delete"/></a>

        ),
    },
]


const mapStateToProps = (state) => {

    return {
        listEnrolled: state.enrollment.listEnrolled

    };
};


export default connect(
    mapStateToProps,
    {fetchEnrolled}
)(ListEnrolled);
