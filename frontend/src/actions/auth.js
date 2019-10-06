import axios from "axios";
import {createMessage, returnErrors} from "./messages";

import {
    AUTH_ERROR,
    INFORMATIONS_UPDATED,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    USER_LOADED,
    USER_LOADING,
    WAIT_ASK,
    WAIT_FINISH
} from "./types";
import {enrollEmail, enrollUser, fetchChallenges, fetchCourses} from "./application";
import {goBack} from "react-router-redux";

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
export const login = (email, password) => dispatch => {
    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Request Body
    const body = JSON.stringify({email, password});

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
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: LOGIN_FAIL
            });
        });
};

// REGISTER USER
export const createUser = ({email, listCourseId}) => (dispatch, getState) => {


    const password = 'sEFlTJAbAW'
    const body = JSON.stringify({email, password});
    axios
        .post("/api/auth/createUser", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le compte à été crée."}));
            axios.post("/api/auth/reset-password",JSON.stringify({email}),{headers: { "Content-Type": "application/json"}})
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        })
    listCourseId.map((course) => {
        dispatch(enrollEmail({course,email}))
    });

};


// REGISTER USER
export const createStaff = ({email}) => (dispatch, getState) => {


    const password = 'sEFlTJAbAW'
    const body = JSON.stringify({email, password});

    axios
        .post("/api/auth/createStaff", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le compte à été crée."}));
            axios.post("/api/auth/reset-password",JSON.stringify({email}),{headers: { "Content-Type": "application/json"}})
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
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};

export const updatePasswordStaff = ({new_password,user_id}) => (dispatch, getState) => {


    const body = JSON.stringify({new_password,user_id});

    axios
        .put("/api/auth/change_password_staff", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le mot de passe à été changé."}));

        })
        .catch(err => {
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
                type: WAIT_FINISH
            });

        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: WAIT_ASK
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
            dispatch(goBack())

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
