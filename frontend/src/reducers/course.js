import {ADD_COURSE, ADD_COURSE_FAIL, EDIT_COURSE, FETCH_COURSES, REMOVE_COURSE} from "../actions/types";

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
        case EDIT_COURSE:
            return {
                ...state,
                listCourse: state.listCourse.map(course => {
                    if (course.course_id == action.payload.course_id)
                        return action.payload
                    return course
                })
            }
        case REMOVE_COURSE:
            return {
                ...state,
                listCourse: state.listCourse.filter(course => course.course_id != action.payload)
            }
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
