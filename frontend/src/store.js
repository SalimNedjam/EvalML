import {applyMiddleware, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {routerMiddleware} from 'react-router-redux'
import thunk from "redux-thunk";
import rootReducer from "./reducers";

import {browserHistory} from 'react-router'


const initialState = {};

const middleware = [thunk, routerMiddleware(browserHistory)];

const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);


export default store;