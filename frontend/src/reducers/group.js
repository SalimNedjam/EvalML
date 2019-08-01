import {
    ADD_TO_GROUP,
    CREATE_GROUP,
    FETCH_GROUP,
    FETCH_NON_GROUPED,
    FETCH_NON_GROUPED_FAIL,
    REMOVE_GROUP
} from "../actions/types";

const initialState = {

    listNonGrouped: [],
    listGroup: []

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
        case FETCH_GROUP:
            return {
                ...state,
                listGroup: action.payload
            }
        case CREATE_GROUP:

            return {
                ...state,
                listGroup: action.payload
            }
        case REMOVE_GROUP:
            return {
                ...state,
                listGroup: state.listGroup.filter(group => group.id != action.payload)
            }
        default:
            return state;
    }
}
