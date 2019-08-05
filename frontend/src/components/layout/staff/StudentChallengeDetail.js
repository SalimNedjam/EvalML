import React, {Component} from "react";
import {createMessage} from "../../../actions/messages";
import {connect} from 'react-redux'
import {Col, Row} from 'antd'
import TableSubmission from "./TableSubmission";

export class StudentChallengeDetail extends Component {


    render() {
        const {match = {}} = this.props;
        const challenge = match.params.challenge;
        const user = match.params.user;

        return (

            <Row type="flex" justify="center" gutter={10} style={{
                margin: '24px 16px',
                padding: 24,
                background: '#fff',
            }}>

                <Col xs={24} sm={26} md={20} lg={14} xl={12}>
                </Col>

                <Col xs={30} sm={26} md={20} lg={14} xl={12}>
                    <Col>
                        <TableSubmission challenge={challenge} user={user}/>

                    </Col>
                </Col>


            </Row>


        );
    }


}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        listChallenge: state.challenge.listChallenge,
    };
};

export default connect(
    mapStateToProps,
    {createMessage}
)(StudentChallengeDetail);
