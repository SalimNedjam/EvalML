import {CREATE_MESSAGE} from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
    if (action.type === CREATE_MESSAGE) {
        return (action.payload);
    } else {
        return state;
    }
}
