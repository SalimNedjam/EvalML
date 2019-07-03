import {
    ADD_CHALLENGE,
    ADD_CHALLENGE_FAIL,
    ADD_COURSE,
    ADD_COURSE_FAIL,
    CHALLENGE_SELECTED,
    ENROLL_USER,
    FETCH_CHALLENGES,
    FETCH_COURSES,
    FETCH_NON_ENROLLED,
    FETCH_NON_ENROLLED_FAIL
} from "../actions/types";

const initialState = {
    challengeSelected: null,
    listChallenge: [],
    listCourse: [],
    listNonEnrolled:[],
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
        case FETCH_COURSES:
            return {
                ...state,
                listCourse: action.payload
            };

        case ADD_COURSE:

            return {
                ...state,
                listCourse:[...state.listCourse, action.payload]
            }
        case FETCH_NON_ENROLLED:
            return {
                ...state,
                listNonEnrolled:action.payload
            }
        case FETCH_NON_ENROLLED_FAIL:
            return {
                ...state,
                listNonEnrolled: []
            }
        case ENROLL_USER:

            return {
                ...state,
                listNonEnrolled: state.listNonEnrolled.filter(user => user.user_id != action.payload)
            }
        case ADD_CHALLENGE:

            return {
                ...state,
                listChallenge:[...state.listChallenge, action.payload]
            }
        case ADD_CHALLENGE_FAIL:
        case ADD_COURSE_FAIL:
            return state;
        default:
            return state;
    }
}
