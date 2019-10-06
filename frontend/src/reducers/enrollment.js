import {
    ENROLL_USER, ENROLL_USER_EMAIL, FETCH_ALL,
    FETCH_ENROLLED,
    FETCH_ENROLLED_FAIL,
    FETCH_NON_ENROLLED,
    FETCH_NON_ENROLLED_FAIL,
    REMOVE_ENROLLMENT
} from "../actions/types";

const initialState = {
    challengeSelected: null,
    listChallenge: [],
    listCourse: [],
    listAll:[],
    listNonEnrolled: [],
    listNonManager: [],
    listEnrolled: [],
    listManager: [],
    listNonGrouped: [],

};


export default function (state = initialState, action) {
    switch (action.type) {

        case FETCH_NON_ENROLLED:
            return {
                ...state,
                listNonEnrolled: action.payload
            }
        case FETCH_ALL:
            return {
                ...state,
                listAll: action.payload
            }
        case FETCH_NON_ENROLLED_FAIL:
            return {
                ...state,
                listNonEnrolled: []
            }
        case FETCH_ENROLLED:
            return {
                ...state,
                listEnrolled: action.payload
            }
        case FETCH_ENROLLED_FAIL:
            return {
                ...state,
                listEnrolled: []
            }

        case ENROLL_USER_EMAIL:
            return {
                ...state,
                listNonEnrolled: state.listNonEnrolled.filter(user => user.email != action.payload)
            }

        case ENROLL_USER:

            return {
                ...state,
                listNonEnrolled: state.listNonEnrolled.filter(user => user.user_id != action.payload)
            }
        case REMOVE_ENROLLMENT:

            return {
                ...state,
                listEnrolled: state.listEnrolled.filter(enrollment => enrollment.id != action.payload)
            }


        default:
            return state;
    }
}
