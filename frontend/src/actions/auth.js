import axios from "axios";
import {createMessage, returnErrors} from "./messages";

import {
    AUTH_ERROR,
    INFORMATIONS_UPDATED,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    USER_LOADED,
    USER_LOADING
} from "./types";
import {enrollUser, fetchChallenges, fetchCourses} from "./application";

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({type: USER_LOADING});

    axios
        .get("/api/auth/user", tokenConfig(getState))
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            });
            dispatch(fetchChallenges())
            dispatch(fetchCourses())

        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        });
};

// LOGIN USER
export const login = (username, password) => dispatch => {
    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Request Body
    const body = JSON.stringify({username, password});

    axios
        .post("/api/auth/login", body, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
            dispatch(fetchChallenges())
            dispatch(fetchCourses())
        })
        .catch(err => {
            console.log(err);
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: LOGIN_FAIL
            });
        });
};

// REGISTER USER
export const createUser = ({matricule, username, listCourseId}) => (dispatch, getState) => {


    const password = 'rand'
    console.log(listCourseId)
    const body = JSON.stringify({matricule, username, password});

    axios
        .post("/api/auth/createUser", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le compte à été crée."}));
            listCourseId.map((course) => {
                console.log({course, user: res.data.user.user_id})
                dispatch(enrollUser({course, user: res.data.user.user_id}))
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};


// REGISTER USER
export const updatePassword = ({old_password, new_password}) => (dispatch, getState) => {


    const body = JSON.stringify({old_password, new_password});

    axios
        .put("/api/auth/change_password", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le mot de passe à été changé."}));

        })
        .catch(err => {
            console.log(err)
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};

export const resetPassword = (password, token) => (dispatch) => {

    const body = JSON.stringify({password, token});
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    axios
        .post("/api/auth/reset-password/confirm", body, config)
        .then(res => {
            dispatch(createMessage({addUser: "Mot de passe changé."}));
            dispatch({
                type: REGISTER_SUCCESS
            });

        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: REGISTER_FAIL
            });

        });
};


export const requestReset = ({email}) => (dispatch) => {

    const body = JSON.stringify({email});
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    axios
        .post("/api/auth/reset-password", body, config)
        .then(res => {
            dispatch(createMessage({addUser: "Email envoyé."}));


        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));


        });
};

// REGISTER USER
export const updateInformations = ({first_name, last_name}) => (dispatch, getState) => {


    const body = JSON.stringify({first_name, last_name});

    axios
        .put("/api/auth/change_informations", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Vos informations ont été changées."}));
            dispatch({
                type: INFORMATIONS_UPDATED,
                payload: res.data
            });
        })
        .catch(err => {
            console.log(err)
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};


// LOGOUT USER
export const logout = () => (dispatch, getState) => {
    axios
        .post("/api/auth/logout/", null, tokenConfig(getState))
        .then(res => {
            dispatch({type: 'CLEAR_LEADS'});
            dispatch({
                type: LOGOUT_SUCCESS
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};

// Setup config with token - helper function
export const tokenConfig = getState => {
    // Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    // If token, add to headers config
    if (token) {
        config.headers["Authorization"] = `Token ${token}`;
    }

    return config;
};
