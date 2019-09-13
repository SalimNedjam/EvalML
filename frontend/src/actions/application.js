import {
    ADD_CHALLENGE,
    ADD_CHALLENGE_FAIL,
    ADD_COURSE,
    ADD_COURSE_FAIL,
    ADD_MANAGER,
    ADD_TO_GROUP,
    CREATE_GROUP,
    CREATE_SUBMISSION,
    EDIT_CHALLENGE,
    EDIT_COURSE,
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
    REMOVE_COURSE,
    REMOVE_ENROLLMENT,
    REMOVE_GROUP,
    REMOVE_MANAGER,
    REMOVE_SUBMISSION,
    SWITCH_GROUP_EDIT,
    SWITCH_SUBMISSION_DELETE,
    SWITCH_VISIBILITY,
    WAIT_ASK
} from "./types";
import axios from 'axios';
import {createMessage, returnErrors} from "./messages";
import {tokenConfig} from "./auth";
import {goBack} from "react-router-redux";


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


export const duplicateChallenge = ({course_id, challenge_id}) => (dispatch, getState) => {

    const body = JSON.stringify({course_id, challenge_id});
    axios
        .post("/api/challenge/duplicate_challenge", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le challenge à bien été dupliqué."}));
            dispatch({
                type: ADD_CHALLENGE,
                payload: res.data.challenge
            });

        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};

export const duplicateCourse = (course_id) => (dispatch, getState) => {

    const body = JSON.stringify({course_id});
    axios
        .post("/api/course/duplicate_course", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le cours à bien été dupliqué."}));
            dispatch({
                type: ADD_COURSE,
                payload: res.data.course
            });
            store.dispatch(goBack())

            dispatch(fetchChallenges())
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};

export const createChallenge = ({description, title, course, nbStudent, nbSubmit, limitDate, scriptFile, inputParam, inputExt, outputs, truthFiles, datasets, command, args, scoreKeys}) => (dispatch, getState) => {
        let data = new FormData();
        data.append("description", description)
        data.append("title", title)
        data.append("course", course)
        data.append("nbStudent", nbStudent)
        data.append("nbSubmit", nbSubmit)
        data.append("limitDate", limitDate)
        for (let i = 0; i < scriptFile.length; i++) {
            if (scriptFile[i] !== undefined)
                data.append("scriptFile", scriptFile[i])
        }
        for (let i = 0; i < scoreKeys.length; i++) {
            if (scoreKeys[i] !== "")
                data.append("scoreKeys[" + i + "]", scoreKeys[i])
        }
        for (let i = 0; i < datasets.length; i++) {
            if (datasets[i] !== undefined)
                data.append("dataset[" + i + "]", datasets[i])
        }
        for (let i = 0; i < args.length; i++) {
            if (args[i].ext !== '' && args[i].param !== '') {
                data.append("argsValue[" + i + "]", args[i].value)
                data.append("argsParam[" + i + "]", args[i].param)
            }
        }
        for (let i = 0; i < truthFiles.length; i++) {
            if (truthFiles[i].param !== '' && truthFiles[i].scriptFile[0] !== undefined) {
                data.append("truthFiles[" + i + "]", truthFiles[i].scriptFile[0])
                data.append("truthFilesParam[" + i + "]", truthFiles[i].param)
            }
        }
        for (let i = 0; i < outputs.length; i++) {
            if (outputs[i].ext !== '' && outputs[i].param !== '') {
                data.append("outputsExt[" + i + "]", outputs[i].ext)
                data.append("outputsParam[" + i + "]", outputs[i].param)
            }

        }
        data.append("inputParam", inputParam)
        data.append("inputExt", inputExt)
        data.append("command", command)
        axios
            .post("/api/challenge/create_challenge", data, tokenConfigMultiPart(getState))
            .then(res => {
                dispatch(createMessage({addUser: "Le challenge à été crée."}));
                dispatch({
                    type: ADD_CHALLENGE,
                    payload: res.data.challenge
                });
                dispatch(goBack())
            })
            .catch(err => {
                dispatch(returnErrors(err.response.data, err.response.status));
                dispatch({
                    type: ADD_CHALLENGE_FAIL
                });
            });
    }
;


export const updateChallenge = ({challenge_id, description, title, course, nbStudent, nbSubmit, limitDate, scriptFile, inputParam, inputExt, outputs, truthFiles, datasets, command, args, scoreKeys}) => (dispatch, getState) => {
        let data = new FormData();
        data.append("description", description)
        data.append("title", title)
        data.append("course", course)
        data.append("challenge_id", challenge_id)
        data.append("nbStudent", nbStudent)
        data.append("nbSubmit", nbSubmit)
        data.append("limitDate", limitDate)
        for (let i = 0; i < scriptFile.length; i++) {
            if (scriptFile[i] !== undefined)
                data.append("scriptFile", scriptFile[i])
        }
        for (let i = 0; i < scoreKeys.length; i++) {
            if (scoreKeys[i] !== "")
                data.append("scoreKeys[" + i + "]", scoreKeys[i])
        }
        for (let i = 0; i < datasets.length; i++) {
            if (datasets[i] !== undefined)
                data.append("dataset[" + i + "]", datasets[i])
        }
        for (let i = 0; i < args.length; i++) {
            if (args[i].ext !== '' && args[i].param !== '') {
                data.append("argsValue[" + i + "]", args[i].value)
                data.append("argsParam[" + i + "]", args[i].param)
            }
        }
        for (let i = 0; i < truthFiles.length; i++) {
            if (truthFiles[i].param !== '' && truthFiles[i].scriptFile[0] !== undefined) {
                data.append("truthFiles[" + i + "]", truthFiles[i].scriptFile[0])
                data.append("truthFilesParam[" + i + "]", truthFiles[i].param)
            }
        }
        for (let i = 0; i < outputs.length; i++) {
            if (outputs[i].ext !== '' && outputs[i].param !== '') {
                data.append("outputsExt[" + i + "]", outputs[i].ext)
                data.append("outputsParam[" + i + "]", outputs[i].param)
            }

        }
        data.append("inputParam", inputParam)
        data.append("inputExt", inputExt)
        data.append("command", command)
        axios
            .put("/api/challenge/edit_challenge", data, tokenConfigMultiPart(getState))
            .then(res => {
                dispatch(createMessage({addUser: "Le challenge à été mis à jour."}));
                dispatch({
                    type: EDIT_CHALLENGE,
                    payload: res.data.challenge
                });
                dispatch(goBack())
            })
            .catch(err => {
                dispatch(returnErrors(err.response.data, err.response.status));
                dispatch({
                    type: ADD_CHALLENGE_FAIL
                });
            });
    }
;


// ADD COURSE
export const createCourse = ({description, nbStudent, nbSubmit}) => (dispatch, getState) => {


    const body = JSON.stringify({description, nbStudent, nbSubmit});

    axios
        .post("/api/course/create_course", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addCourse: "Le cours à été crée."}));
            dispatch({
                type: ADD_COURSE,
                payload: res.data.course
            });
            dispatch(goBack())
        })
        .catch(err => {
            console.log(err)
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: ADD_COURSE_FAIL
            });
        });
};

export const editCourse = ({description, nbStudent, nbSubmit,course_id}) => (dispatch, getState) => {


    const body = JSON.stringify({description, nbStudent, nbSubmit,course_id});

    axios
        .put("/api/course/edit_course", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addCourse: "Le cours à été modifié."}));
            dispatch({
                type: EDIT_COURSE,
                payload: res.data.course
            });
            dispatch(goBack())

        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};

export const fetchNonEnrolled = course => (dispatch, getState) => {

    axios.get('/api/enrollment/fetch_non_enrolled?course_id=' + course, tokenConfig(getState))
        .then(res => {
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
            dispatch(goBack())
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });

};


export const fetchNonManager = course => (dispatch, getState) => {

    axios.get('/api/management/fetch_non_manager?course_id=' + course, tokenConfig(getState))
        .then(res => {
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
    axios.get('/api/group/fetch_non_grouped?challenge=' + challenge, tokenConfig(getState))
        .then(res => {
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
            dispatch(goBack())
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
            dispatch(goBack())
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};

export const forceAddToGroup = ({challenge, user, group_id}) => (dispatch, getState) => {

    const body = JSON.stringify({challenge, user, group_id});
    axios
        .post("/api/group/add_to_group_staff", body, tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le membre à été ajouté au groupe."}));
            dispatch({
                type: ADD_TO_GROUP,
                payload: user
            });
            dispatch(goBack())
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

export const removeCourse = (id) => (dispatch, getState) => {

    axios
        .delete("/api/course/remove_course/" + id + "/", tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Le cours à été retiré."}));
            dispatch({
                type: REMOVE_COURSE,
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
            dispatch({
                type: SWITCH_VISIBILITY,
                payload: res.data.challenge
            });


        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};


export const switchGroup = (id) => (dispatch, getState) => {

    axios
        .put("/api/challenge/switch_edit_group/" + id + "/", null, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: SWITCH_GROUP_EDIT,
                payload: res.data.challenge
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));

        });
};

export const switchSubmission = (id) => (dispatch, getState) => {

    axios
        .put("/api/challenge/switch_delete_submission/" + id + "/", null, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: SWITCH_SUBMISSION_DELETE,
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
export const fetchSubmissionStaff = ({challenge, user}) => (dispatch, getState) => {

    axios.get('/api/submission/fetch_submission_staff?challenge_id=' + challenge + "&user=" + user, tokenConfig(getState))
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
            dispatch({
                type: FETCH_GROUP,
                payload: res.data
            })
        }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));

    });
};

export const forceFetchGroup = (challenge_id) => (dispatch, getState) => {

    axios.get('/api/group/list_groups_challenge?challenge=' + challenge_id, tokenConfig(getState))
        .then(res => {

            dispatch({
                type: FETCH_GROUP,
                payload: res.data
            })

        }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
    })
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


export const forceRemoveGroup = (id) => (dispatch, getState) => {

    axios
        .delete("/api/group/remove_user_group/" + id + "/", tokenConfig(getState))
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


export const removeSubmission = (id) => (dispatch, getState) => {

    axios
        .delete("/api/submission/remove_submission/" + id + "/", tokenConfig(getState))
        .then(res => {
            dispatch(createMessage({addUser: "Vous avez supprimé cette soumission."}));
            dispatch({
                type: REMOVE_SUBMISSION,
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
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        }
    };

    // If token, add to headers config
    if (token) {
        config.headers["Authorization"] = `Token ${token}`;
    }

    return config;
};

