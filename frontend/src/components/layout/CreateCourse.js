import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createCourse } from "../../actions/application";
import { createMessage } from "../../actions/messages";

export class CreateUser extends Component {
  state = {
    description: "",

  };

  static propTypes = {
    createUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };

  onSubmit = e => {
    e.preventDefault();
    const { description } = this.state;
    const newCourse = {
        description,
    }

      this.props.createCourse(newCourse);
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {

    const { description } = this.state;
    return (
      <div className="col-md-6 m-auto">
        <div className="card card-body mt-5">
          <h2 className="text-center">Ajouter un cours</h2>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Nom du cours</label>
              <input
                type="text"
                className="form-control"
                name="description"
                onChange={this.onChange}
                value={description}
              />
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
}



const mapStateToProps = (state) => {
  console.log(state)
    return {isAuthenticated: state.auth.isAuthenticated};
};

export default connect(mapStateToProps, { createCourse, createMessage })(CreateUser);
