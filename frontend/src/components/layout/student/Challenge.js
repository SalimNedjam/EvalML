import React, {Component} from "react";
import {createMessage} from "../../../actions/messages";
import {connect} from 'react-redux'
import {Col, Row} from 'antd'

import TableSubmission from "./TableSubmission";

import TableGroup from "./TableGroup";

export class Challenge extends Component {


    render() {
        const {match = {}} = this.props;
        const challenge = match.params.challenge;


        const challengeObject = this.props.listChallenge.filter(function (chal) {
            return chal.challenge_id == challenge;
        })[0];
        return (

            <Row type="flex" justify="center" gutter={10}>

                <Col xs={24} sm={26} md={20} lg={14} xl={12}>
                    <TableSubmission challenge={challenge}/>
                </Col>

                <Col xs={30} sm={26} md={20} lg={14} xl={12}>
                    <Col>
                        <TableGroup challenge={challenge}/>
                    </Col>
                </Col>


            </Row>


        );
    }


}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        auth: state.auth,
        listChallenge: state.challenge.listChallenge,
    };
};

export default connect(
    mapStateToProps,
    {createMessage}
)(Challenge);
