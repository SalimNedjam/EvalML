import {combineReducers} from "redux";
import application from "./application";
import messages from "./messages";
import auth from "./auth";
import err from "./err";


export default combineReducers({
    application,
    err,
    messages,
    auth
});
