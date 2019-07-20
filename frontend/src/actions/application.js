import {
    ADD_CHALLENGE,
    ADD_CHALLENGE_FAIL,
    ADD_COURSE,
    ADD_COURSE_FAIL,
    ADD_MANAGER,
    ADD_TO_GROUP,
    CHALLENGE_SELECTED,
    CREATE_GROUP,
    CREATE_SUBMISSION,
    ENROLL_USER,
    FETCH_CHALLENGES,
    FETCH_COURSES,
    FETCH_ENROLLED,
    FETCH_ENROLLED_FAIL,
    FETCH_GROUP,
    FETCH_MANAGER,
    FETCH_MANAGER_FAIL,
    FETCH_NON_ENROLLED,
    FETCH_NON_ENROLLED_FAIL,
    FETCH_NON_GROUPED,
    FETCH_NON_GROUPED_FAIL,
    FETCH_NON_MANAGER,
    FETCH_NON_MANAGER_FAIL,
    FETCH_SUBMISSION,
    REMOVE_CHALLENGE,
    REMOVE_ENROLLMENT,
    REMOVE_GROUP,
    REMOVE_MANAGER,
    SWITCH_VISIBILITY,
    WAIT_ASK
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

    axios.get('/api/challenge/challenge', tokenConfig(getState))
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

    axios.get('/api/course/course', tokenConfig(getState))
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


export const createChallenge = ({description, title, input_types, course, nbStudent, nbSubmit, limitDate}) => (dispatch, getState) => {


    const body = JSON.stringify({description, title, input_types, course, nbStudent, nbSubmit, limitDate});

    axios
        .post("/api/challenge/create_challenge", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le challenge à été crée."}));
            dispatch({
                type: ADD_CHALLENGE,
                payload: res.data.challenge
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: ADD_CHALLENGE_FAIL
            });
        });
};


// ADD COURSE
export const createCourse = ({description, nbStudent, nbSubmit}) => (dispatch, getState) => {


    const body = JSON.stringify({description, nbStudent, nbSubmit});

    axios
        .post("/api/course/create_course", body, tokenConfig(getState))
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

    axios.get('/api/enrollment/fetch_non_enrolled?course_id=' + course, tokenConfig(getState))
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

    axios.get('/api/enrollment/fetch_enrolled?course_id=' + course, tokenConfig(getState))
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
        .post("/api/enrollment/enroll_course", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "L'étudiant à été inscrit au cours."}));
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

    axios.get('/api/management/fetch_non_manager?course_id=' + course, tokenConfig(getState))
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
        .post("/api/management/add_manager", body, tokenConfig(getState))
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


export const removeEnrollment = (id) => (dispatch, getState) => {

    axios
        .delete("/api/enrollment/remove_enrollment/" + id + "/", tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "L'étudiant à été désinscrit au cours."}));
            dispatch({
                type: REMOVE_ENROLLMENT,
                payload: id
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};


export const removeManager = (id) => (dispatch, getState) => {

    axios
        .delete("/api/management/remove_manager/" + id + "/", tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le membre du staff à été retiré."}));
            dispatch({
                type: REMOVE_MANAGER,
                payload: id
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};


export const removeChallenge = (id) => (dispatch, getState) => {

    axios
        .delete("/api/challenge/remove_challenge/" + id + "/", tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le challenge à été retiré."}));
            dispatch({
                type: REMOVE_CHALLENGE,
                payload: id
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};


export const switchVisibility = (id) => (dispatch, getState) => {

    axios
        .put("/api/challenge/switch_visibility/" + id + "/", null, tokenConfig(getState))
        .then(res => {
            console.log(res.data)
            dispatch({
                type: SWITCH_VISIBILITY,
                payload: res.data.challenge
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};


export const createSubmission = ({challenge, input_file}) => (dispatch, getState) => {

    let data = new FormData();

    data.append('input_file', input_file);
    axios
        .post("/api/submission/" + challenge + "/", data, tokenConfigMultiPart(getState))
        .then(res => {
            dispatch({
                type: CREATE_SUBMISSION,
                payload: res.data
            })

        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: WAIT_ASK
            })
        });

};


export const fetchSubmission = (challenge_id) => (dispatch, getState) => {

    axios.get('/api/submission/fetch_submission?challenge_id=' + challenge_id, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: FETCH_SUBMISSION,
                payload: res.data
            })
        }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));

    });
};


export const fetchGroup = (challenge_id) => (dispatch, getState) => {

    axios.get('/api/group/user_list_group_challenge?challenge=' + challenge_id, tokenConfig(getState))
        .then(res => {
            let array = []
            res.data.map((user, index) => {
                let obj = reduceObjValues(user)
                obj.key = index
                array.push(obj)
            });
            dispatch({
                type: FETCH_GROUP,
                payload: array
            })
        }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));

    });
};


export const createGroup = (challenge) => (dispatch, getState) => {

    const body = JSON.stringify({challenge});
    axios
        .post("/api/group/create_group", body, tokenConfig(getState))
        .then(res => {
            let array = []
            array.push(reduceObjValues(res.data))
            dispatch(createMessage({addUser: "Vous avez crée un groupe."}));
            dispatch({
                type: CREATE_GROUP,
                payload: array
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};


export const removeGroup = (id) => (dispatch, getState) => {

    axios
        .delete("/api/group/remove_user/" + id + "/", tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Vous avez supprimé cet utilisateur."}));
            dispatch({
                type: REMOVE_GROUP,
                payload: id
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};

export const clearWait = () => (dispatch) => {
    dispatch({
        type: WAIT_ASK,
    });

}


export const reduceObjValues = (obj, cache = {}) => {
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


// Setup config with token - helper function
export const tokenConfigMultiPart = getState => {
    // Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    };

    // If token, add to headers config
    if (token) {
        config.headers["Authorization"] = `Token ${token}`;
    }

    return config;
};
