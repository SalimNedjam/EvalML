import {CHALLENGE_SELECTED, FETCH_CHALLENGES} from "./types";
import axios from 'axios';


export const selectChallenge = (challenge) => {
    return {
        type: CHALLENGE_SELECTED,
        payload: challenge
    }
};

export const fetchChallenges = () => dispatch => {
    axios.get('https://jsonplaceholder.typicode.com/posts/')
        .then(res => {
            dispatch({
                type: FETCH_CHALLENGES,
                payload: res.data
            })
        }).catch(err => console.log(err));
};
