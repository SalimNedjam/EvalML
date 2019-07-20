import React, {Component} from "react";
import {Link} from 'react-router-dom'
import {Button, Result} from 'antd';
import {clearWait} from "../../../actions/application";
import {connect} from 'react-redux'

export class SuccessSubmit extends Component {

    render() {
        this.props.clearWait();
        return (
            <Result
                status="success"
                title="Response Successfully Submited !"
                extra={<Link to="/"><Button type="primary">Back Home</Button></Link>}
            />
        )
    }

}


export default connect(null, {clearWait})(SuccessSubmit);