import {
    ADD_COURSE, ADD_COURSE_FAIL,
    AUTH_ERROR,
    CHALLENGE_SELECTED,
    FETCH_CHALLENGES,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    USER_LOADED,
    USER_LOADING
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

    axios.get('/api/auth/challenge',tokenConfig(getState))
        .then(res => {
            dispatch({
                type: FETCH_CHALLENGES,
                payload: res.data
            })
        }).catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};



export const createChallenge = ({matricule, username}) => (dispatch, getState) => {



    const password='rand'
    const body = JSON.stringify({matricule, username,password});

    axios
        .post("/api/auth/create_challenge", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({ addUser: "Le compte à été crée."}));
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            console.log(err)
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: REGISTER_FAIL
            });
        });
};


// ADD COURSE
export const createCourse = ({description}) => (dispatch, getState) => {

    console.log(description)

    const body = JSON.stringify({description});
    console.log(body)

    axios
        .post("/api/auth/create_course", body, tokenConfig(getState))
        .then(res => {
            console.log(res.data)
            dispatch(createMessage({ addCourse: "Le cours à été crée."}));
            dispatch({
                type: ADD_COURSE,
                payload: res.data
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