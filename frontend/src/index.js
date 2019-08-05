import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import store from "./store";
import {browserHistory} from 'react-router'
import {BrowserRouter as Router} from 'react-router-dom'

import {Provider as AlertProvider} from "react-alert";
import {syncHistoryWithStore} from "react-router-redux";


const alertOptions = {
    timeout: 3000,
    position: "top center"
};

const AlertTemplate = ({style, options, message, close}) => (

    options.type === 'info' && <div style={style} className="alert alert-info" role="alert">
        {message}
    </div>
    ||
    options.type === 'success' && <div style={style} className="alert alert-success" role="alert">
        {message}
    </div>
    ||
    options.type === 'error' && <div style={style} className="alert alert-danger" role="alert">
        {message}
    </div>

);

export const history = syncHistoryWithStore(browserHistory, store)

const myApp = (
    <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
            <Router history={history}>
                <App/>
            </Router>
        </AlertProvider>
    </Provider>);

ReactDOM.render(myApp, document.getElementById('app'));