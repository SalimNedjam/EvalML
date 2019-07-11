import {ADD_CHALLENGE, ADD_CHALLENGE_FAIL, FETCH_CHALLENGES} from "../actions/types";

const initialState = {
    listChallenge: [],


};


export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_CHALLENGES:
            return {
                ...state,
                listChallenge: action.payload
            };

        case ADD_CHALLENGE:

            return {
                ...state,
                listChallenge: [...state.listChallenge, action.payload]
            }
        case ADD_CHALLENGE_FAIL:
            return state;
        default:
            return state;
    }
}
