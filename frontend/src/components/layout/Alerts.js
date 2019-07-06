import React, {Component, Fragment} from "react";
import {withAlert} from "react-alert";
import {connect} from "react-redux";
import PropTypes from "prop-types";


export class Alerts extends Component {
    static propTypes = {
        error: PropTypes.object.isRequired,
        message: PropTypes.object.isRequired
    };

    componentDidUpdate(prevProps) {
        const error = this.props.error;
        const alert = this.props.alert;
        const message = this.props.message;

        if (error !== prevProps.error) {
            if (error.msg.name) alert.error(`Name: ${error.msg.name.join()}`);
            if (error.msg.username) alert.error(`Email: ${error.msg.username.join()}`);
            if (error.msg.message)
                alert.error(`Message: ${error.msg.message.join()}`);
            if (error.msg.non_field_errors)
                alert.error(error.msg.non_field_errors.join());
            if (error.msg.matricule) alert.error(`Matricule: ${error.msg.matricule.join()}`);
            if (error.msg.description) alert.error(`Description: ${error.msg.description.join()}`);
            if (error.msg.password) alert.error(`Password: ${error.msg.password.join()}`);
            if (error.msg.new_password) alert.error(`Nouveau mot de passe: ${error.msg.new_password.join()}`);
            if (error.msg.detail && error.msg.detail !== "Token non valide.") alert.error(`Attention: ${error.msg.detail}`);


        }

        if (message !== prevProps.message) {
            if (message.addUser) alert.success(message.addUser);
            if (message.addCourse) alert.success(message.addCourse);
            if (message.passwordNotMatch) alert.error(message.passwordNotMatch);
            if (message.selectItem) alert.error(message.selectItem);
            if (message.isEmptyTitle) alert.error(message.isEmptyTitle);
            if (message.isEmptyDescription) alert.error(message.isEmptyDescription);

        }
    }

    render() {
        return <Fragment/>;
    }
}

const mapStateToProps = state => ({
    message: state.messages,
    error: state.err
});

export default connect(mapStateToProps)(withAlert()(Alerts));


