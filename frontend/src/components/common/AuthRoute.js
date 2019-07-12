import React from "react";
import {Redirect, Route} from "react-router-dom";
import {connect} from "react-redux";

const PrivateRoute = ({component: Component, auth, ...rest}) => (
    <Route
        {...rest}
        render={props => {

            if (auth.isLoading)
                return (<div className="d-flex justify-content-center">
                    <div className="spinner-grow" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>)

            else if (auth.isAuthenticated !== null && !auth.isAuthenticated)
                return <Redirect to="/login"/>;

            else if (auth.isAuthenticated !== null && auth.isAuthenticated)
                return <Component {...props} />;


        }}
    />
);

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
