import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {createChallenge} from "../../actions/application";
import {createMessage} from "../../actions/messages";

export class CreateChallenge extends Component {
    state = {
        description: "",
        title: "",
        categories: [{name: ""}],
        input_types: [],
        course_id: "0",

    };

    static propTypes = {
        createChallenge: PropTypes.func.isRequired,
        listCourse: PropTypes.array.isRequired,
        isAuthenticated: PropTypes.bool
    };


    handleCategorieNameChange = idx => evt => {
        const newCategorie = this.state.categories.map((categorie, sidx) => {
            if (idx !== sidx) return categorie;
            return {...categorie, name: evt.target.value};
        });

        this.setState({categories: newCategorie});
    };


    handleAddCategorie = () => {
        if(this.state.categories[this.state.categories.length-1].name!=="")
        this.setState({
            categories: this.state.categories.concat([{name: ""}])
        });

    };

    handleRemoveCategorie = idx => () => {
        this.setState({
            categories: this.state.categories.filter((s, sidx) => idx !== sidx)
        });
    };


    renderCategories() {
        return (
            <div>
                <div>
                    <label>Categories</label>

                </div>
                <div>
                    {
                        this.state.categories.map((shareholder, idx) => (
                            <div className="form-row align-items-center">
                                <div className="col-sm-4 my-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Catégorie name"
                                        value={shareholder.name}
                                        onChange={this.handleCategorieNameChange(idx)}
                                    />
                                </div>
                                <div className="col-auto my-1">
                                    <button type="button" className="close" onClick={this.handleRemoveCategorie(idx)}
                                            aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>))}

                    <button type="button"  className="btn btn-secondary btn-sm" onClick={this.handleAddCategorie} >
                        Add new categorie
                    </button>
                </div>
            </div>
        )
    }


    onSubmit = e => {
        console.log(this.state)
        e.preventDefault();
        const {description, title, categories, input_types, course_id} = this.state;
        const newChallenge = {description, title, categories, input_types, course_id}

        this.props.createChallenge(newChallenge);
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});

    renderList() {
        return this.props.listCourse.map((course) => {
            return <option value={course.course.course_id}>{course.course.description}</option>
        })
    }

    render() {

        const {description, title, categories, input_types, course_id} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Ajouter un challenge</h2>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <div className="form-group">
                                <label htmlFor="exampleFormControlSelect1">Selectioner le cours</label>
                                <select value={course_id} onChange={this.onChange} className="form-control"
                                        id="exampleFormControlSelect1">
                                    {this.renderList()}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Nom du challenge</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                onChange={this.onChange}
                                value={title}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description du challenge</label>
                            <textarea
                                rows="3"
                                className="form-control"
                                name="description"
                                onChange={this.onChange}
                                value={description}
                            />
                        </div>

                        <div className="form-group">
                            {
                                this.renderCategories()
                            }
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
    return {
        isAuthenticated: state.auth.isAuthenticated,
        listCourse: state.application.listCourse
    };
};

export default connect(mapStateToProps, {createChallenge, createMessage})(CreateChallenge);
