import {ADD_COURSE, ADD_COURSE_FAIL, CHALLENGE_SELECTED, FETCH_CHALLENGES} from "../actions/types";

const initialState = {
    challengeSelected: null,
    listChallenge: [],
    listCourse: [],
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

        case ADD_COURSE:

            return {
                ...state,
                listCourse:[...state.listCourse, action.payload]
            }


        case ADD_COURSE_FAIL:
            return state;
        default:
            return state;
    }
}
