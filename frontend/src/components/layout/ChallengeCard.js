import React, {Component} from 'react';
import {connect} from "react-redux";
import {selectChallenge} from "../../actions/application";
import PropTypes from "prop-types";

class ChallengeCard extends Component {
    static propTypes = {
        selectChallenge: PropTypes.func.isRequired,
    };

    constructor() {
        super();
        this.state = {
            currentSelected: 'challenge',
            challengeState: active,
            lastSubmitState: simple,
            resultsState: simple

        }
    }


    render() {
        return (
            <div className="card text-center" style={{width: "40%", margin: "40px"}}>
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <a className={this.state.challengeState} href="#"
                               onClick={() => this.onClickBadge('challenge')}>Challenge</a>
                        </li>
                        <li className="nav-item">
                            <a className={this.state.lastSubmitState} href="#"
                               onClick={() => this.onClickBadge('lastSubmit')}>Submit history</a>
                        </li>
                        <li className="nav-item">
                            <a className={this.state.resultsState} href="#"
                               onClick={() => this.onClickBadge('results')}>Results</a>
                        </li>
                    </ul>
                </div>
                {this.state.currentSelected === "challenge" ?
                    <ChallengeTab selectChallenge={this.props.selectChallenge} challenge={this.props.challenge}/> :
                    (this.state.currentSelected === "lastSubmit" ?
                        <LastSubmitTab challenge={this.props.challenge}/> :
                        <ResultsTab challenge={this.props.challenge}/>)}

            </div>
        )

    }

    onClickBadge(item) {
        if (item === "challenge" && this.state.challengeState !== disable)
            this.setState({
                currentSelected: item,
                challengeState: active,
                lastSubmitState: this.state.lastSubmitState !== disable ? simple : this.state.lastSubmitState,
                resultsState: this.state.resultsState !== disable ? simple : this.state.resultsState
            });
        else if (item === "lastSubmit" && this.state.lastSubmitState !== disable)
            this.setState({
                currentSelected: item,
                challengeState: this.state.challengeState !== disable ? simple : this.state.challengeState,
                lastSubmitState: active,
                resultsState: this.state.resultsState !== disable ? simple : this.state.resultsState
            });
        else if (item === "results" && this.state.resultsState !== disable)
            this.setState({
                currentSelected: item,
                challengeState: this.state.challengeState !== disable ? simple : this.state.challengeState,
                lastSubmitState: this.state.lastSubmitState !== disable ? simple : this.state.lastSubmitState,
                resultsState: active
            });

    }
}

const active = 'nav-link active';
const disable = 'nav-link disabled';
const simple = 'nav-link';


const LastSubmitTab = props => {
    return <div>
        <div className="card-body">
            <h5 className="card-title">{props.challenge.title}</h5>
            <p className="card-text">{props.challenge.body}</p>
        </div>
    </div>
};

const ResultsTab = props => {
    return <div>
        <div className="card-body">
            <h5 className="card-title">{props.challenge.title}</h5>
            <p className="card-text">{props.challenge.description}</p>
        </div>
    </div>
};


const ChallengeTab = props => {
    return <div>
        <div className="card-body">
            <h5 className="card-title">{props.challenge.title}</h5>
            <p className="card-text">{props.challenge.description}</p>
            <a href="#" className="btn btn-primary" onClick={() => props.selectChallenge(props.challenge)}>Open the
                challenge</a>
        </div>
    </div>
};


export default connect(null, {selectChallenge})(ChallengeCard);

