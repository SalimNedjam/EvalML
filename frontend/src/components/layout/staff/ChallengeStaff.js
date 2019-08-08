import React, {Component} from "react";
import {createMessage} from "../../../actions/messages";
import {connect} from 'react-redux'
import {Col, Row} from 'antd'

import TableGroup from "./TableGroup";
import LeaderBoardTable from "./LeaderBoardTable";
import ChallengeStats from "./ChallengeStats";

export class ChallengeStaff extends Component {


    render() {
        const {match = {}} = this.props;
        const challenge = match.params.challenge;
        return (

            <Row type="flex" justify="center" gutter={10} style={{
                margin: '24px 16px',
                padding: 24,
                background: '#fff',
            }}>

                <Col xs={24} sm={26} md={20} lg={14} xl={12}>
                    <ChallengeStats challenge={challenge}/>

                    <LeaderBoardTable challenge={challenge}/>
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
    return {
        auth: state.auth,
        listChallenge: state.challenge.listChallenge,
    };
};

export default connect(
    mapStateToProps,
    {createMessage}
)(ChallengeStaff);
