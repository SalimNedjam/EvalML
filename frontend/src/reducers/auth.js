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
} from "../actions/types";

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isLoading: false,
    user: null,
    updatedPassword: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload
            };
        case LOGIN_SUCCESS:
            localStorage.setItem("token", action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false
            };
        case REGISTER_FAIL:
            return {
                ...state,
                isLoading: false,
                updatedPassword: false
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                updatedPassword: true
            };
        case INFORMATIONS_UPDATED:
            return {
                ...state,
                ...action.payload,
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };
        default:
            return state;
    }
}
