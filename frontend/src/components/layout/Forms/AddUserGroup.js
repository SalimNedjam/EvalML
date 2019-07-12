import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {addToGroup, clearNonGrouped, fetchNotInGroup} from "../../../actions/application";
import {createMessage} from "../../../actions/messages";


export class AddUserGroup extends Component {
    static propTypes = {
        listChallenge: PropTypes.array.isRequired,
        listNonGrouped: PropTypes.array.isRequired,
        fetchNotInGroup: PropTypes.func.isRequired,
        clearNonGrouped: PropTypes.func.isRequired


    };
    state = {
        user: -1,
        challenge: -1,

    };

    onSubmit = e => {
        e.preventDefault();
        const {user, challenge} = this.state;

        if (challenge === "-1" || challenge === -1)
            this.props.createMessage({selectItem: "Veuiller séléctioner un challenge"});
        else if (user === "-1" || user === -1)
            this.props.createMessage({selectItem: "Veuiller séléctioner un étudiant"});
        else {
            const newMemberGroup = {challenge, user}
            this.props.addToGroup(newMemberGroup)
        }


    };

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    };

    renderListChallenge() {
        return this.props.listChallenge.map((challenge) => {
            return <option value={challenge.challenge_id} key={challenge.challenge_id}>{challenge.title}</option>
        })
    }


    renderListStudent() {
        return this.props.listNonGrouped.map((user) => {
            return <option value={user.user_id} key={user.user_id}>{user.username}</option>
        })
    }

    onChangeChallenge = e => {
        this.setState({
            [e.target.name]: e.target.value,
            user: -1
        })

        if (e.target.value === -1 || e.target.value == "-1") {
            this.props.clearNonGrouped()
        } else {
            this.props.fetchNotInGroup(e.target.value)

        }

    }


    render() {

        const {user, challenge} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Ajouter un étudiant au cours</h2>

                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <div className="form-group">
                                <label>Selectioner un challenge</label>
                                <select
                                    className="form-control"
                                    name="challenge"
                                    value={challenge}
                                    onChange={this.onChangeChallenge}>
                                    <option value={-1}/>
                                    {this.renderListChallenge()}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-group">
                                <label>Selectioner l'étudiant</label>
                                <select
                                    className="form-control"
                                    name="user"
                                    value={user}
                                    onChange={this.onChange}
                                >
                                    <option value={-1}/>
                                    {this.renderListStudent()}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Ajouter
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        );
    }

    clearNotInGroup() {
        this.setState({listNotInGroup: []})
    }
}


const mapStateToProps = (state) => {
    return {
        listChallenge: state.challenge.listChallenge,
        listNonGrouped: state.group.listNonGrouped,

    };
};

export default connect(mapStateToProps, {
    addToGroup,
    fetchNotInGroup,
    clearNonGrouped,
    createMessage,
})(AddUserGroup);
