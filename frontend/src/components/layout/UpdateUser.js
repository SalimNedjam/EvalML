import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createUser } from "../../actions/auth";
import { createMessage } from "../../actions/messages";

export class UpdateUser extends Component {
  state = {
    email: this.props.user.username,
    matricule: this.props.user.matricule,
    password: "",
    password2: "",
    lastpassword:"",
    last_name: this.props.user.last_name,
    first_name: this.props.user.first_name,
  };

  static propTypes = {
    createUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    user:PropTypes.object,
  };

  onSubmit = e => {
    e.preventDefault();
    const { email, matricule, password, password2, lastpassword, last_name, first_name } = this.state;
    if (password !== password2) {
      this.props.createMessage({ passwordNotMatch: "Passwords do not match" });
    } else {
      const newUser = {
        email,
        password,
        matricule
      };
      this.props.createUser(newUser);
    }
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    if (this.props.isAuthenticated===false) {
      return <Redirect to="/login" />;
    }
    const { email, matricule, password, password2,lastpassword, last_name, first_name } = this.state;
    return (
      <div className="col-md-6 m-auto">
        <div className="card card-body mt-5">
          <h2 className="text-center">Update User</h2>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                disabled={true}
                value={email}
              />
            </div>
            <div className="form-group">
              <label>Matricule</label>
              <input
                type="number"
                className="form-control"
                name="matricule"
                disabled={true}
                onChange={this.onChange}
                value={matricule}
              />
            </div>
             <div className="form-group">
              <label>Prénoms</label>
              <input
                type="text"
                className="form-control"
                name="password2"
                onChange={this.onChange}
                value={first_name}
              />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                className="form-control"
                name="password2"
                onChange={this.onChange}
                value={last_name}
              />
            </div>
            <div className="form-group">
              <label>Last password</label>
              <input
                type="password"
                className="form-control"
                name="lastpassword"
                onChange={this.onChange}
                value={lastpassword}
              />
            </div>
            <div className="form-group">
              <label>New password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                onChange={this.onChange}
                value={password}
              />
            </div>
            <div className="form-group">
              <label>Confirm new password</label>
              <input
                type="password"
                className="form-control"
                name="password2"
                onChange={this.onChange}
                value={password2}
              />
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </div>

          </form>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  console.log(state)
    return {
      isAuthenticated: state.auth.isAuthenticated,
      user: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  { createUser, createMessage }
)(UpdateUser);
