import {
    ADD_CHALLENGE,
    ADD_CHALLENGE_FAIL,
    ADD_COURSE,
    ADD_COURSE_FAIL,
    ADD_MANAGER,
    CHALLENGE_SELECTED,
    ENROLL_USER,
    FETCH_CHALLENGES,
    FETCH_COURSES,
    FETCH_NON_ENROLLED,
    FETCH_NON_ENROLLED_FAIL,
    FETCH_NON_MANAGER,
    FETCH_NON_MANAGER_FAIL
} from "./types";
import axios from 'axios';
import {createMessage, returnErrors} from "./messages";
import {tokenConfig} from "./auth";


export const selectChallenge = (challenge) => {
    return {
        type: CHALLENGE_SELECTED,
        payload: challenge
    }
};

export const fetchChallenges = () => (dispatch, getState) => {

    axios.get('/api/auth/challenge', tokenConfig(getState))
        .then(res => {
            dispatch({
                type: FETCH_CHALLENGES,
                payload: res.data
            })
        }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));

    });
};

export const fetchCourses = () => (dispatch, getState) => {

    axios.get('/api/auth/course', tokenConfig(getState))
        .then(res => {
            console.log(res.data)
            dispatch({
                type: FETCH_COURSES,
                payload: res.data
            })
        }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));

    });
};


export const createChallenge = ({description, title, input_types, course, nbStudent, nbSubmit, freqSubmit}) => (dispatch, getState) => {


    const body = JSON.stringify({description, title, input_types, course, nbStudent, nbSubmit, freqSubmit});

    axios
        .post("/api/auth/create_challenge", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le challenge à été crée."}));
            dispatch({
                type: ADD_CHALLENGE,
                payload: res.data.challenge
            });
        })
        .catch(err => {
            console.log(err)
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: ADD_CHALLENGE_FAIL
            });
        });
};


// ADD COURSE
export const createCourse = ({description, nbStudent, nbSubmit, freqSubmit}) => (dispatch, getState) => {


    const body = JSON.stringify({description, nbStudent, nbSubmit, freqSubmit});

    axios
        .post("/api/auth/create_course", body, tokenConfig(getState))
        .then(res => {
            console.log(res.data)
            dispatch(createMessage({addCourse: "Le cours à été crée."}));
            dispatch({
                type: ADD_COURSE,
                payload: res.data.course
            });
        })
        .catch(err => {
            console.log(err)
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: ADD_COURSE_FAIL
            });
        });
};


export const fetchNonEnrolled = course => (dispatch, getState) => {

    axios.get('/api/auth/fetch_non_enrolled?course_id=' + course, tokenConfig(getState))
        .then(res => {
            console.log(res.data)
            dispatch({
                type: FETCH_NON_ENROLLED,
                payload: res.data
            })
        }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: FETCH_NON_ENROLLED_FAIL,
        })
    });
};


export const clearNonEnrolled = () => (dispatch) => {

    dispatch({
        type: FETCH_NON_ENROLLED_FAIL,
    })
};


export const enrollUser = ({course, user}) => (dispatch, getState) => {

    const body = JSON.stringify({course, user});
    axios
        .post("/api/auth/enroll_course", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "L'étudient à été inscrit au cours."}));
            dispatch({
                type: ENROLL_USER,
                payload: user
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};


export const fetchNonManager = course => (dispatch, getState) => {

    axios.get('/api/auth/fetch_non_manager?course_id=' + course, tokenConfig(getState))
        .then(res => {
            console.log(res.data)
            dispatch({
                type: FETCH_NON_MANAGER,
                payload: res.data
            })
        }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: FETCH_NON_MANAGER_FAIL,
        })
    });
};


export const clearNonManager = () => (dispatch) => {

    dispatch({
        type: FETCH_NON_MANAGER_FAIL,
    })
};


export const addManager = ({course, user, is_admin}) => (dispatch, getState) => {

    const body = JSON.stringify({course, user, is_admin});
    axios
        .post("/api/auth/add_manager", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le membre du staff à été ajouté au cours."}));
            dispatch({
                type: ADD_MANAGER,
                payload: user
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};
