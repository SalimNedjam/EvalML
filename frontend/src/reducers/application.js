import {CHALLENGE_SELECTED, FETCH_CHALLENGES} from "../actions/types";

const initialState = {
    challengeSelected: null,
    listChallenge: []
};


export default function (state = initialState, action) {
    switch (action.type) {
        case CHALLENGE_SELECTED:
            return {
                ...state,
                challengeSelected: action.payload
            };

        case FETCH_CHALLENGES:
            return {
                ...state,
                listChallenge: action.payload
            };

        default:
            return state;
    }
}
