import {ADD_TO_GROUP, FETCH_NON_GROUPED, FETCH_NON_GROUPED_FAIL} from "../actions/types";

const initialState = {

    listNonGrouped: [],

};


export default function (state = initialState, action) {
    switch (action.type) {

        case ADD_TO_GROUP:
            return {
                ...state,
                listNonGrouped: state.listNonGrouped.filter(user => user.user_id != action.payload)
            }
        case FETCH_NON_GROUPED:
            return {
                ...state,
                listNonGrouped: action.payload
            }
        case FETCH_NON_GROUPED_FAIL:
            return {
                ...state,
                listNonGrouped: []
            }

        default:
            return state;
    }
}
