import React, {Component} from "react";
import {Table} from 'antd'
import axios from 'axios'
import {connect} from 'react-redux';
import {FiDownloadCloud} from "react-icons/fi";

export class DatasetTable extends Component {

    static propTypes = {};


    column = [
        {
            title: 'file',
            key: 'file',
            render: (text, record) => {
                let array=record.file.split('/');
                return array[array.length-1]
            },


        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                [
                    <a onClick={() => this.askFile(record)}> <FiDownloadCloud style={IconStyle}/></a>
                ]

            ),
        }

    ]

    askFile(record) {
        const token = this.props.auth.token
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        config.headers["Authorization"] = `Token ${token}`;


        axios.get('api/challenge/get_file/?file_id=' + record.file_id, config)
            .then(res => {
                let fileName = res.headers["content-disposition"].split("filename=")[1];
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName); //or any other extension
                document.body.appendChild(link);
                link.click();
            }).catch(err => {
            console.log(err.data)
        })
    }

    getChallange(){
        const _this=this
        return this.props.listChallenge.find(function(element) {
            return element.challenge_id == _this.props.challenge;
        })
    }
    render() {
        const challenge=this.getChallange()
        return (
            <div>
                <h4 className="text-center">Dataset</h4>

                <Table
                    className="components-table-demo-nested"
                    columns={this.column}
                    rowKey='file_id'
                    dataSource={challenge!=undefined?challenge.dataset:[]}
                />
            </div>)


    }

}
const IconStyle = {
    fontSize: '18px',
    marginRight: '5px'
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        listChallenge: state.challenge.listChallenge

    };
};


export default connect(mapStateToProps)(DatasetTable);
