import {
    ADD_MANAGER,
    FETCH_MANAGER,
    FETCH_MANAGER_FAIL,
    FETCH_NON_MANAGER,
    FETCH_NON_MANAGER_FAIL,
    REMOVE_MANAGER
} from "../actions/types";

const initialState = {

    listNonManager: [],
    listManager: [],

};


export default function (state = initialState, action) {
    switch (action.type) {

        case FETCH_MANAGER:
            return {
                ...state,
                listManager: action.payload
            }
        case FETCH_MANAGER_FAIL:
            return {
                ...state,
                listManager: []
            }

        case FETCH_NON_MANAGER:
            return {
                ...state,
                listNonManager: action.payload
            }
        case FETCH_NON_MANAGER_FAIL:
            return {
                ...state,
                listNonManager: []
            }

        case ADD_MANAGER:

            return {
                ...state,
                listNonManager: state.listNonManager.filter(user => user.user_id != action.payload)
            }

        case REMOVE_MANAGER:

            return {
                ...state,
                listManager: state.listManager.filter(manager => manager.id != action.payload)
            }


        default:
            return state;
    }
}
