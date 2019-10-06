import React, {Component} from "react";
import PropTypes from "prop-types";
import Textarea from 'react-textarea-autosize';
import {Button, DatePicker, Divider, Icon, Upload} from 'antd';
import {createChallenge} from "../../../actions/application";
import {createMessage} from "../../../actions/messages";
import {connect} from "react-redux";

export class CreateChallenge extends Component {
    static propTypes = {
        createChallenge: PropTypes.func.isRequired,
        listCourse: PropTypes.array.isRequired,
        listChallenge: PropTypes.array.isRequired,

    };
    state = {
        description: "",
        title: "",
        inputParam: "",
        inputExt: "",
        scoreKeys: [""],
        outputs: [
            {
                param: "",
                ext: ""
            }],
        args: [
            {
                param: "",
                value: ""
            }],

        truthFiles: [
            {
                param: "",
                scriptFile: []
            }],
        datasets: [],
        course: -1,
        scriptFile: [],
        uploading: false,
        nbStudent: "",
        nbSubmit: "",
        challenge: -1,
        limitDate: "",
        command: "",
        uploadScript: false,


    };


    handleArgsChangeParam = idx => evt => {
        const newArgs = this.state.args.map((arg, sidx) => {
            if (idx !== sidx) return arg;
            return {...arg, param: evt.target.value};
        });

        this.setState({args: newArgs});
    };

    handleArgsChangeValue = idx => evt => {
        const newArgs = this.state.args.map((arg, sidx) => {
            if (idx !== sidx) return arg;
            return {...arg, value: evt.target.value};
        });

        this.setState({args: newArgs});
    };


    handleAddArgs = () => {
        if (this.state.args.length === 0 || (this.state.args[this.state.args.length - 1].ext !== ""
            && this.state.args[this.state.args.length - 1].value !== ""))
            this.setState({
                args: this.state.args.concat([{value: "", param: ""}])
            });

    };


    handleRemoveArgs = idx => () => {
        this.setState({
            args: this.state.args.filter((s, sidx) => idx !== sidx)
        });
    };

    renderArgs() {
        return (
            <div>
                <div>
                    <label>Arguments</label>

                </div>
                <div>
                    {
                        this.state.args.map((arg, idx) => (
                            <div className="form-row align-items-center" key={idx}>
                                <div className="col-sm-4 my-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Params"
                                        value={arg.param}
                                        onChange={this.handleArgsChangeParam(idx)}
                                    />
                                </div>
                                <div className="col-sm-4 my-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Valeur"
                                        value={arg.value}
                                        onChange={this.handleArgsChangeValue(idx)}
                                    />
                                </div>
                                <div className="col-auto my-1">
                                    <button type="button" className="close" onClick={this.handleRemoveArgs(idx)}
                                            aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>))}

                    <button type="button" className="btn btn-secondary btn-sm" onClick={this.handleAddArgs}>
                        Add new argument
                    </button>
                </div>
            </div>
        )
    }


    handleOutputChangeParam = idx => evt => {
        const newOutput = this.state.outputs.map((output, sidx) => {
            if (idx !== sidx) return output;
            return {...output, param: evt.target.value};
        });

        this.setState({outputs: newOutput});
    };

    handleOutputChangeExt = idx => evt => {
        const newOutput = this.state.outputs.map((output, sidx) => {
            if (idx !== sidx) return output;
            return {...output, ext: evt.target.value};
        });

        this.setState({outputs: newOutput});
    };


    handleAddOutput = () => {
        if (this.state.outputs.length === 0 || (this.state.outputs[this.state.outputs.length - 1].ext !== ""
            && this.state.outputs[this.state.outputs.length - 1].param !== ""))
            this.setState({
                outputs: this.state.outputs.concat([{ext: "", param: ""}])
            });

    };


    handleRemoveOutput = idx => () => {
        this.setState({
            outputs: this.state.outputs.filter((s, sidx) => idx !== sidx)
        });
    };

    renderOutputs() {
        return (
            <div>
                <div>
                    <label>Outputs</label>

                </div>
                <div>
                    {
                        this.state.outputs.map((output, idx) => (
                            <div className="form-row align-items-center" key={idx}>
                                <div className="col-sm-4 my-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Params"
                                        value={output.param}
                                        onChange={this.handleOutputChangeParam(idx)}
                                    />
                                </div>
                                <div className="col-sm-4 my-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Extension"
                                        value={output.ext}
                                        onChange={this.handleOutputChangeExt(idx)}
                                    />
                                </div>
                                <div className="col-auto my-1">
                                    <button type="button" className="close" onClick={this.handleRemoveOutput(idx)}
                                            aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>))}

                    <button type="button" className="btn btn-secondary btn-sm" onClick={this.handleAddOutput}>
                        Add new output
                    </button>
                </div>
            </div>
        )
    }


    handleScoreKeyNameChange = idx => evt => {
        const newInput = this.state.scoreKeys.map((input, sidx) => {
            if (idx !== sidx)
                return input;
            return evt.target.value;
        });

        this.setState({scoreKeys: newInput});
    };


    handleAddScoreKey = () => {
        if (this.state.scoreKeys.length === 0 || this.state.scoreKeys[this.state.scoreKeys.length - 1] !== "")
            this.setState({
                scoreKeys: [...this.state.scoreKeys, ""]
            });

    };

    handleRemoveScoreKey = idx => () => {
        this.setState({
            scoreKeys: this.state.scoreKeys.filter((s, sidx) => idx !== sidx)
        });
    };


    renderScoreKey() {
        return (
            <div>
                <div>
                    <label>Donner les clés des score qui sont dans le fichier score.json</label>


                </div>
                <div>
                    {
                        this.state.scoreKeys.map((input, idx) => (
                            <div className="form-row align-items-center" key={idx}>
                                <div className="col-sm-4 my-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="key"
                                        value={input}
                                        onChange={this.handleScoreKeyNameChange(idx)}
                                    />
                                </div>
                                <div className="col-auto my-1">
                                    <button type="button" className="close" onClick={this.handleRemoveScoreKey(idx)}
                                            aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>))}

                    <button type="button" className="btn btn-secondary btn-sm" onClick={this.handleAddScoreKey}>
                        Add new score key
                    </button>
                </div>
            </div>
        )
    }


    handleTruthChangeParam = idx => evt => {
        const newOutput = this.state.truthFiles.map((truth, sidx) => {
            if (idx !== sidx) return truth;
            return {...truth, param: evt.target.value};
        });

        this.setState({truthFiles: newOutput});
    };


    handleAddTruth = () => {

        if (this.state.truthFiles.length === 0 || this.state.truthFiles[this.state.truthFiles.length - 1].param !== "")
            this.setState({
                truthFiles: this.state.truthFiles.concat([{scriptFile: [], param: ""}])
            });

    };


    handleRemoveTruth = idx => () => {
        this.setState({
            truthFiles: this.state.truthFiles.filter((s, sidx) => idx !== sidx)
        });
    };

    renderTruths() {
        const {truthFiles} = this.state;


        return (
            <div>
                <div>
                    <label>Truth files</label>

                </div>
                <div>
                    {
                        this.state.truthFiles.map((truth, idx) => (
                            <span className=" form-row align-items-center" key={idx}>

                                <div className="col-sm-4 my-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Params"
                                        value={truth.param}
                                        onChange={this.handleTruthChangeParam(idx)}
                                    />
                                </div>

                                <Upload className="col-sm-4 my-1"
                                        onRemove={file => {
                                            this.setState(state => {
                                                const index = state.truthFiles[idx].scriptFile.indexOf(file);
                                                const newFileList = state.truthFiles[idx].scriptFile.slice();
                                                newFileList.splice(index, 1);
                                                let temp = this.state.truthFiles
                                                temp[idx].scriptFile = newFileList;
                                                return {
                                                    truthFiles: temp
                                                };
                                            });
                                        }}
                                        beforeUpload={
                                            file => {
                                                let temp = this.state.truthFiles
                                                temp[idx].scriptFile = [file];
                                                this.setState({
                                                    truthFiles: temp
                                                });
                                                return false;
                                            }
                                        }
                                        fileList={truthFiles[idx].scriptFile}>
                                    <Button className="col-auto my-1">
                                        <Icon type="upload"/> Select Script
                                    </Button>
                                </Upload>
                                <div className="col-auto my-1">
                                    <button type="button" className="close" onClick={this.handleRemoveTruth(idx)}
                                            aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </span>))}

                    <button type="button" className="btn btn-secondary btn-sm" onClick={this.handleAddTruth}>
                        Add new truth
                    </button>
                </div>
            </div>
        )
    }

    renderDatasets() {
        const {datasets} = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.datasets.indexOf(file);
                    const newFileList = state.datasets.slice();
                    newFileList.splice(index, 1);
                    return {
                        datasets: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    datasets: [...state.datasets, file],
                }));
                return false;
            },
            datasets,
        };

        return (
            <div>
                <div>
                    <label>Datasets</label>

                </div>
                <Upload {...props} multiple={true}>
                    <Button>
                        <Icon type="upload"/> Select Datasets
                    </Button>
                </Upload>
            </div>
        );
    }


    onSubmit = e => {
        e.preventDefault();
        const {description, title, course, nbStudent, nbSubmit, limitDate, scriptFile, inputExt, inputParam, outputs, truthFiles, datasets, command, args, scoreKeys} = this.state;


        if (title === "")
            this.props.createMessage({isEmptyDescription: "La description ne peut pas etre vide"});
        else if (description === "")
            this.props.createMessage({isEmptyTitle: "La nom du challenge ne peut pas etre vide"});
        else if (nbStudent === "")
            this.props.createMessage({isEmptyTitle: "Le nombre maximum d'étudiants par groupe ne peut pas etre vide"});
        else if (nbSubmit === "")
            this.props.createMessage({isEmptyTitle: "Le nombre maximum de soumissions ne peut pas etre vide"});
        else if (limitDate === "")
            this.props.createMessage({isEmptyTitle: "La date limite de soumission ne peut pas etre vide"});
        else if (command === "")
            this.props.createMessage({isEmptyTitle: "La commande pour lancer le script ne peut pas etre vide"});
        else if (scriptFile.length === 0)
            this.props.createMessage({isEmptyTitle: "Le script d'évalution ne peut pas etre vide"});
        else if (scoreKeys.length === 0 || (scoreKeys.length === 1 && scoreKeys[0] == ""))
            this.props.createMessage({isEmptyTitle: "Il faut donner au moin une clé de score"});
        else if (inputExt === "")
            this.props.createMessage({isEmptyTitle: "L'extension du fichier de soumission ne peut pas etre vide"});
        else if (inputParam === "")
            this.props.createMessage({isEmptyTitle: "Le parametre du fichier de soumission  ne peut pas etre vide"});
        else {

            const newChallenge = {
                description,
                title,
                course,
                nbStudent,
                nbSubmit,
                limitDate,
                scriptFile,
                inputParam,
                inputExt,
                outputs,
                truthFiles,
                datasets,
                scoreKeys,
                command,
                args
            };
            this.props.createChallenge(newChallenge)
        }


    };

    componentDidMount() {
        const {match = {}} = this.props;
        const course_id = match.params.course_id
        var course = this.props.listCourse.find(item => item.course_id == course_id);
        if (course != undefined)
            this.setState({
                course: course_id,
                nbStudent: course.nbStudent,
                nbSubmit: course.nbSubmit,
            })


    }


    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    };

    onTimeChange = (value, dateString) => {
        this.setState({
            limitDate: dateString
        })

    }


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

    onChangeName = e => {
        this.setState({[e.target.name]: e.target.value.replace(/\s+/g, '')})
    };

    printHeader() {
        const {command, inputParam, inputExt, scriptFile} = this.state;
        return command + " " + (scriptFile.length > 0 ? scriptFile[0].name : "") + (inputParam !== "" ? " -" + inputParam : "") + (inputExt !== "" ? " soumission" + "\." + inputExt : "") + " "
    }

    printTruth() {
        let str = ""

        this.state.truthFiles.forEach(function (item) {
            if (item.scriptFile.length > 0 && item.param !== "")
                str += "-" + item.param + " " + item.scriptFile[0].name + " "
        });
        return str
    }

    printArgs() {
        let str = ""

        this.state.args.forEach(function (item) {
            if (item.value !== "" && item.param !== "")
                str += "-" + item.param + " " + item.value + " "
        });
        return str
    }

    printOutputs() {
        let str = ""
        this.state.outputs.forEach(function (item, index) {
            if (item.ext !== "" && item.param !== "")
                str += "-" + item.param + " output" + index + "." + item.ext + " "

        });
        str += "-log logfile.log "
        str += "-score scorefile.json"

        return str

    }


    render() {

        const {description, title, course, nbStudent, nbSubmit, challenge, inputParam, inputExt, command, scriptFile} = this.state;

        const props = {
                onRemove: file => {
                    this.setState(state => {
                        const index = state.scriptFile.indexOf(file);
                        const newFileList = state.scriptFile.slice();
                        newFileList.splice(index, 1);
                        return {
                            scriptFile: newFileList,
                        };
                    });
                },
                beforeUpload: file => {
                    this.setState({
                        scriptFile: [file],
                    });
                    return false;
                },
                handleChange: info => {
                    let scriptFile = [...info.scriptFile];

                    if (scriptFile.length > 0)
                        scriptFile = [scriptFile[0]];
                    this.setState({scriptFile});
                },
                fileList: scriptFile,
            }
        ;


        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Ajouter un challenge</h2>

                    <form onSubmit={this.onSubmit}>


                        <div className="form-group">
                            <label>Nom du challenge</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                onChange={this.onChangeName}
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
                            <label>Date limite de soumission</label>
                            <div>
                                <DatePicker showTime placeholder="Date limite" onChange={this.onTimeChange}/>
                            </div>
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
                        <br/>
                        <Divider>Section script d'évalutation</Divider>
                        <div className="form-group">
                            <label>
                                {"$ "
                                +
                                this.printHeader()
                                +
                                this.printTruth()
                                +
                                this.printArgs()
                                +
                                this.printOutputs()
                                }
                            </label>
                        </div>
                        <div className="form-group">
                            <label>Commande</label>
                            <input
                                type="text"
                                className="form-control"
                                name="command"
                                placeholder="Exemple: python"
                                onChange={this.onChange}
                                value={command}

                            />
                        </div>
                        <div className="form-group">
                            <Upload {...props}>
                                <Button>
                                    <Icon type="upload"/> Select Script
                                </Button>
                            </Upload>

                        </div>
                        <div className="form-group">
                            {
                                this.renderScoreKey()
                            }
                        </div>
                        < div className="form-group">
                            <label>Information sur le fichier de soumission</label>

                            <div className=" form-row align-items-center">

                                <div className="col-sm-4 my-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="inputParam"
                                        placeholder="Parametre"
                                        onChange={this.onChange}
                                        value={inputParam}
                                    />
                                </div>
                                <div className="col-sm-4 my-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="inputExt"
                                        placeholder="Extension"
                                        onChange={this.onChange}
                                        value={inputExt}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            {
                                this.renderDatasets()
                            }
                        </div>
                        <div className="form-group">
                            {
                                this.renderTruths()
                            }
                        </div>
                        <div className="form-group">
                            {
                                this.renderArgs()
                            }
                        </div>
                        <div className="form-group">
                            {
                                this.renderOutputs()
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
    return {
        listCourse: state.course.listCourse,
        listChallenge: state.challenge.listChallenge
    };
};

export default connect(mapStateToProps, {createChallenge, createMessage})(CreateChallenge);
