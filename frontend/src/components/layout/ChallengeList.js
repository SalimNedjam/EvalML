import React, {Component} from 'react';
import {connect} from 'react-redux';
import ChallengeCard from "./ChallengeCard";
import PropTypes from "prop-types";

class ChallengeList extends Component {
    static propTypes = {
        listChallenge: PropTypes.array.isRequired,
    };


    render() {

        return (<div>
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
    return {listChallenge: state.challenge.listChallenge};
};

export default connect(mapStateToProps)(ChallengeList);
