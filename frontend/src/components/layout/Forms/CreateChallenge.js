import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {createChallenge} from "../../../actions/application";
import {createMessage} from "../../../actions/messages";
import Textarea from 'react-textarea-autosize';

export class CreateChallenge extends Component {
    state = {
        description: "",
        title: "",
        inputs: [""],
        course: -1,
        nbStudent: "",
        nbSubmit: "",
        freqSubmit: "",
        challenge: -1,


    };

    static propTypes = {
        createChallenge: PropTypes.func.isRequired,
        listCourse: PropTypes.array.isRequired,
        listChallenge: PropTypes.array.isRequired,

    };


    handleInputNameChange = idx => evt => {
        const newInput = this.state.inputs.map((input, sidx) => {
            if (idx !== sidx)
                return input;
            return evt.target.value;
        });

        this.setState({inputs: newInput});
    };


    handleAddInput = () => {
        if (this.state.inputs[this.state.inputs.length - 1] !== "")
            this.setState({
                inputs: [...this.state.inputs, ""]
            });

    };

    handleRemoveInput = idx => () => {
        this.setState({
            inputs: this.state.inputs.filter((s, sidx) => idx !== sidx)
        });
    };


    renderInputs() {
        return (
            <div>
                <div>
                    <label>Inputs</label>

                </div>
                <div>
                    {
                        this.state.inputs.map((input, idx) => (
                            <div className="form-row align-items-center" key={idx}>
                                <div className="col-sm-4 my-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="File input name"
                                        value={input}
                                        onChange={this.handleInputNameChange(idx)}
                                    />
                                </div>
                                <div className="col-auto my-1">
                                    <button type="button" className="close" onClick={this.handleRemoveInput(idx)}
                                            aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>))}

                    <button type="button" className="btn btn-secondary btn-sm" onClick={this.handleAddInput}>
                        Add new input
                    </button>
                </div>
            </div>
        )
    }


    onSubmit = e => {
        e.preventDefault();
        const {description, title, course, nbStudent, nbSubmit, freqSubmit} = this.state;
        const input_types = this.state.inputs.filter(Boolean);

        console.log(input_types)
        if (course === -1)
            this.props.createMessage({selectItem: "Veuiller séléctioner un cours"});
        else if (title === "")
            this.props.createMessage({isEmptyDescription: "La description ne peut pas etre vide"});
        else if (description === "")
            this.props.createMessage({isEmptyTitle: "La nom du challenge ne peut pas etre vide"});
        else if (nbStudent === "")
            this.props.createMessage({isEmptyTitle: "Le nombre maximum d'étudiants par groupe ne peut pas etre vide"});
        else if (nbSubmit === "")
            this.props.createMessage({isEmptyTitle: "Le nombre maximum de soumissions ne peut pas etre vide"});
        else if (freqSubmit === "")
            this.props.createMessage({isEmptyTitle: "Le delais entre deux soumission ne peut pas etre vide"});
        else {
            const newChallenge = {description, title, input_types, course, nbStudent, nbSubmit, freqSubmit}
            this.props.createChallenge(newChallenge)
        }


    };
    onChangeCourse = e => {

        var course = this.props.listCourse.find(item => item.course_id == e.target.value);

        this.setState({
            [e.target.name]: e.target.value,
            nbStudent: course.nbStudent,
            nbSubmit: course.nbSubmit,
            freqSubmit: course.freqSubmit,
        })


    }

    onChangeChallenge = e => {

        if (e.target.value != -1) {
            var challenge = this.props.listChallenge.find(item => item.challenge_id == e.target.value);
            this.setState({
                [e.target.name]: e.target.value,
                nbStudent: challenge.nbStudent,
                nbSubmit: challenge.nbSubmit,
                freqSubmit: challenge.freqSubmit,
                description: challenge.description,
                title: challenge.title,
                input_types: challenge.input_types
            })
        } else {
            this.setState({
                [e.target.name]: e.target.value,
            })
        }


    }
    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    };

    renderList() {
        return this.props.listCourse.map((course) => {
            return <option value={course.course_id} key={course.course_id}>{course.description}</option>
        })
    }

    renderListChallenge() {
        return this.props.listChallenge.map((challenge) => {
            return <option value={challenge.challenge_id} key={challenge.challenge_id}>{challenge.title}</option>
        })
    }

    render() {

        const {description, title, course, nbStudent, nbSubmit, freqSubmit, challenge} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Ajouter un challenge</h2>

                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <div className="form-group">
                                <label>Selectioner le cours</label>
                                <select
                                    className="form-control"
                                    name="course"
                                    value={course}
                                    onChange={this.onChangeCourse}>

                                    <option value={-1}/>
                                    {this.renderList()}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="form-group">
                                <br/>
                                <label>Pre-remplir en suivant un challenge existant</label>
                                <label>(Si vous voulez créer un nouveau challenge ignorer ce champs)</label>

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
                        <br/>
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
                            <Textarea
                                className="form-control"
                                name="description"
                                onChange={this.onChange}
                                value={description}
                            />
                        </div>
                        <div className="form-group">
                            <label>Nombre d'étudiants par groupe (Pas de limite = 0)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="nbStudent"
                                onChange={this.onChange}
                                value={nbStudent}
                            />
                        </div>
                        <div className="form-group">
                            <label>Nombre de soumissions (Pas de limite = 0)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="nbSubmit"
                                onChange={this.onChange}
                                value={nbSubmit}

                            />
                        </div>
                        <div className="form-group">
                            <label>Délais entre deux soumission (En minutes)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="freqSubmit"
                                onChange={this.onChange}
                                value={freqSubmit}
                            />
                        </div>
                        <div className="form-group">
                            {
                                this.renderInputs()
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
        listCourse: state.course.listCourse,
        listChallenge: state.challenge.listChallenge
    };
};

export default connect(mapStateToProps, {createChallenge, createMessage})(CreateChallenge);
