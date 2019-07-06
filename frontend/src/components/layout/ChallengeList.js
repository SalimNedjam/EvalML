import React, {Component} from 'react';
import {connect} from 'react-redux';
import ChallengeCard from "./ChallengeCard";
import ChallengeSelected from "./ChallengeSelected";
import PropTypes from "prop-types";

class ChallengeList extends Component {
    static propTypes = {
        listChallenge: PropTypes.array.isRequired,
    };


    render() {

        return (<div>
            {<ChallengeSelected/>}
            {this.renderList()}

        </div>)
    };


    renderList() {
        return this.props.listChallenge.map((challenge) => {
            return <ChallengeCard key={challenge.challenge_id} challenge={challenge}/>
        })
    }
}

const mapStateToProps = (state) => {
    return {listChallenge: state.application.listChallenge};
};

export default connect(mapStateToProps)(ChallengeList);
