import React, {Component} from "react";
import {Link} from 'react-router-dom'
import {Button, Result} from 'antd';


export default class SuccessSubmit extends Component {

    render() {
        return (
            <Result
                status="success"
                title="Response Successfully Submited !"
                extra={<Link to="/"><Button type="primary">Back Home</Button></Link>}
            />
        )
    }

}


