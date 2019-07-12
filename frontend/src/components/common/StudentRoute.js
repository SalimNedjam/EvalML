import React from "react";
import {Redirect, Route} from "react-router-dom";
import {connect} from "react-redux";

const StudentRoute = ({component: Component, auth, ...rest}) => (
    <Route
        {...rest}
        render={props => {

            if (auth.isLoading)
                return (<div className="d-flex justify-content-center">
                    <div className="spinner-grow" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>)
            else if (auth.isAuthenticated !== null && auth.isAuthenticated === false)
                return <Redirect to="/login"/>;
            else if (auth.isAuthenticated)
                if (auth.user.is_staff !== null && auth.user.is_staff === false)
                    return <Component {...props} />;
                else
                    return <Redirect to="/"/>;


        }}
    />
);

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(StudentRoute);
