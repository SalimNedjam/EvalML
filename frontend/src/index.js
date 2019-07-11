import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {Modal} from 'antd'
import store from "./store";
import {HashRouter as Router,} from "react-router-dom";

import {Provider as AlertProvider} from "react-alert";


const alertOptions = {
    timeout: 3000,
    position: "top center"
};

const AlertTemplate = ({options, message}) => (

    options.type === 'info' && info(message)

    ||
    options.type === 'success' && success(message)
    ||
    options.type === 'error' && error(message)

);


function info(message) {
    Modal.info({
        title: 'Information',
        content: message,
    });
}

function success(message) {
    Modal.success({
        title: 'Success',
        content: message,
    });
}

function error(message) {
    Modal.error({
        title: 'Erreur',
        content: message,
    });
}




const myApp = (
    <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
            <Router>
                <App/>
            </Router>
        </AlertProvider>
    </Provider>);

ReactDOM.render(myApp, document.getElementById('app'));
