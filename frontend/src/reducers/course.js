import {ADD_COURSE, ADD_COURSE_FAIL, FETCH_COURSES} from "../actions/types";

const initialState = {
    listCourse: [],
};


export default function (state = initialState, action) {
    switch (action.type) {

        case FETCH_COURSES:
            return {
                ...state,
                listCourse: action.payload
            };

        case ADD_COURSE:

            return {
                ...state,
                listCourse: [...state.listCourse, action.payload]
            }

        case ADD_COURSE_FAIL:
            return state;
        default:
            return state;
    }
}
