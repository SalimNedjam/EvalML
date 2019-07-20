import {CREATE_SUBMISSION, FETCH_SUBMISSION} from "../actions/types";

const initialState = {
    listSubmission: [],


};


export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_SUBMISSION:
            return {
                ...state,
                listSubmission: action.payload
            };

        case CREATE_SUBMISSION:

            return {
                ...state,
                listSubmission: [...state.listSubmission, action.payload]
            }

        default:
            return state;
    }
}
