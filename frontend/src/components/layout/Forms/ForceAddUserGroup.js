import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {clearNonGrouped, fetchNotInGroup, forceAddToGroup} from "../../../actions/application";
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

    };

    onSubmit = e => {
        e.preventDefault();
        const {user} = this.state;
        const {match = {}} = this.props;
        const group_id = match.params.group_id;
        const challenge = match.params.challenge_id;


        if (user === "-1" || user === -1)
            this.props.createMessage({selectItem: "Veuiller séléctioner un étudiant"});
        else {
            const newMemberGroup = {group_id, user, challenge}
            this.props.forceAddToGroup(newMemberGroup)
        }


    };

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    };


    renderListStudent() {
        return this.props.listNonGrouped.map((user) => {
            return <option value={user.user_id} key={user.user_id}>{user.email}</option>
        })
    }

    componentDidMount() {
        const {match = {}} = this.props;

        const challenge = match.params.challenge_id;
        this.props.fetchNotInGroup(challenge)

    }


    render() {

        const {user} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h4 className="text-center">Ajouter un étudiant au groupe</h4>

                    <form onSubmit={this.onSubmit}>

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
        listGroup: state.group.listGroup,
        listNonGrouped: state.group.listNonGrouped,

    };
};

export default connect(mapStateToProps, {
    forceAddToGroup,
    fetchNotInGroup,
    clearNonGrouped,
    createMessage,
})(AddUserGroup);
