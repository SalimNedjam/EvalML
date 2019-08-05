import {combineReducers} from "redux";
import messages from "./messages";
import auth from "./auth";
import err from "./err";
import management from "./management";
import group from "./group";
import enrollment from "./enrollment";
import course from "./course";
import challenge from "./challenge";
import submission from "./submission";
import {routerReducer as routing} from 'react-router-redux'


export default combineReducers({
    challenge,
    course,
    enrollment,
    group,
    management,
    err,
    messages,
    submission,
    auth,
    routing
});
