import React from 'react';
import {connect} from 'react-redux';


const ChallengeSelected = props => {
    return <div>
        {props.mySelectedChallenge === null ? 'none' : props.mySelectedChallenge.title}
    </div>
};

const mapStateToProps = (state) => {
    return {
        mySelectedChallenge: state.application.challengeSelected
    }
};

export default connect(mapStateToProps)(ChallengeSelected);
