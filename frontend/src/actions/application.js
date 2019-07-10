import {
    ADD_CHALLENGE,
    ADD_CHALLENGE_FAIL,
    ADD_COURSE,
    ADD_COURSE_FAIL,
    ADD_MANAGER,
    ADD_TO_GROUP,
    CHALLENGE_SELECTED,
    ENROLL_USER,
    FETCH_CHALLENGES,
    FETCH_COURSES,
    FETCH_ENROLLED,
    FETCH_ENROLLED_FAIL,
    FETCH_MANAGER,
    FETCH_MANAGER_FAIL,
    FETCH_NON_ENROLLED,
    FETCH_NON_ENROLLED_FAIL,
    FETCH_NON_GROUPED,
    FETCH_NON_GROUPED_FAIL,
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

export const fetchEnrolled = (course) => (dispatch, getState) => {

    axios.get('/api/course/fetch_enrolled?course_id=' + course, tokenConfig(getState))
        .then(res => {
            let array = []
            res.data.map((manager, index) => {
                let obj = reduceObjValues(manager)
                obj.key = index
                array.push(obj)
            })
            dispatch({
                type: FETCH_ENROLLED,
                payload: array
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({type: FETCH_ENROLLED_FAIL})
        });
}


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


export const fetchManager = (course) => (dispatch, getState) => {

    axios.get('/api/management/fetch_manager?course_id=' + course, tokenConfig(getState))
        .then(res => {
            let array = []
            res.data.map((manager, index) => {
                let obj = reduceObjValues(manager)
                obj.key = index
                array.push(obj)
            })
            dispatch({
                type: FETCH_MANAGER,
                payload: array
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({type: FETCH_MANAGER_FAIL})
        });
}


export const fetchNotInGroup = challenge => (dispatch, getState) => {
    console.log(challenge)
    axios.get('/api/group/fetch_non_grouped?challenge=' + challenge, tokenConfig(getState))
        .then(res => {
            console.log(res.data)
            dispatch({
                type: FETCH_NON_GROUPED,
                payload: res.data
            })
        }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: FETCH_NON_GROUPED_FAIL,
        })
    });
};


export const clearNonGrouped = () => (dispatch) => {

    dispatch({
        type: FETCH_NON_GROUPED_FAIL,
    })
};


export const clearNonManager = () => (dispatch) => {

    dispatch({
        type: FETCH_NON_MANAGER_FAIL,
    })
};


export const addManager = ({course, user, is_course_admin, is_group_admin}) => (dispatch, getState) => {

    const body = JSON.stringify({course, user, is_course_admin, is_group_admin});
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


export const addToGroup = ({challenge, user}) => (dispatch, getState) => {

    const body = JSON.stringify({challenge, user});
    axios
        .post("/api/group/add_to_group", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le membre à été ajouté au groupe."}));
            dispatch({
                type: ADD_TO_GROUP,
                payload: user
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};


const reduceObjValues = (obj, cache = {}) => {
    const objectValues = Object.keys(obj).reduce((acc, cur) => {
        if (!Array.isArray(obj[cur]) && typeof obj[cur] === 'object') {
            return reduceObjValues({...acc, ...obj[cur]}, cache);
        }
        acc[cur] = obj[cur].toString();

        return acc;
    }, {});

    return {
        ...objectValues,
        ...cache,
    };
}
