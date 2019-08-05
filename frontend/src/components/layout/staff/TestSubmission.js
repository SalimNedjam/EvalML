import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Button, Icon, Upload} from 'antd';
import {returnErrors} from "../../../actions/messages";
import axios from "axios";
import TableSubmission from "./TableSubmission";
import {fetchSubmissionStaff} from "../../../actions/application";

export class TestSubmission extends Component {
    static propTypes = {
        listChallenge: PropTypes.array.isRequired,

    };
    state = {
        tags: [""],
        challenge: -1,
        uploading: false,
        fileList: [],
    };


    componentDidMount() {
        const {match = {}} = this.props;
        this.setState({
            challenge: match.params.challenge,
        });

    }


    handleInputNameChange = idx => evt => {
        const newInput = this.state.tags.map((input, sidx) => {
            if (idx !== sidx)
                return input;
            return evt.target.value;
        });

        this.setState({tags: newInput});
    };


    handleAddInput = () => {
        if (this.state.tags.length === 0 || this.state.tags[this.state.tags.length - 1] !== "")
            this.setState({
                tags: [...this.state.tags, ""]
            });

    };

    handleRemoveInput = idx => () => {
        this.setState({
            tags: this.state.tags.filter((s, sidx) => idx !== sidx)
        });
    };


    renderTags() {
        return (
            <div>
                <div>
                    <label>TAGS</label>

                </div>
                <div>
                    {
                        this.state.tags.map((input, idx) => (
                            <div className="form-row align-items-center" key={idx}>
                                <div className="col-sm-4 my-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tag name"
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
                        Add new tag
                    </button>
                </div>
            </div>
        )
    }


    onSubmit = e => {
        e.preventDefault();
        const {tags, challenge, uploading, fileList} = this.state;

        if (challenge === "-1" || challenge === -1)
            this.props.createMessage({selectItem: "Veuiller séléctioner un challenge"});
        else if (fileList.length == 0) {
            this.props.createMessage({selectItem: "Veuiller séléctioner un fichier"});
        } else {
            this.setState({
                uploading: true,
            });
            const input_file = fileList[0]
            const newSubmission = {challenge, input_file, tags}
            this.sendRequest(newSubmission)
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

    sendRequest({challenge, input_file, tags}) {
        let data = new FormData();

        data.append('input_file', input_file);
        data.append('tags', tags)
        axios
            .post("/api/submission_test/" + challenge + "/", data, this.tokenConfigMultiPart())
            .then(res => {
                this.setState({
                    uploading: false,
                })
                this.props.fetchSubmissionStaff({challenge: challenge, user: this.props.auth.user.user_id})


            })
            .catch(err => {
                console.log(err.response.data)
                this.setState({
                    uploading: false
                })
                this.props.returnErrors(err.response.data, err.response.status);

            });
    }

    tokenConfigMultiPart = () => {
        // Get token from state
        const token = this.props.token

        // Headers
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        // If token, add to headers config
        if (token) {
            config.headers["Authorization"] = `Token ${token}`;
        }

        return config;
    };

    render() {
        const {match = {}} = this.props;
        const challenge = match.params.challenge;

        const {uploading, fileList} = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [file],
                }));
                return false;
            },
            fileList,
        };

        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h3 className="text-center">Tester la soumission</h3>

                    <form>
                        <div className="form-group">
                            {
                                this.renderTags()
                            }
                        </div>
                        <div className="form-group">
                            <div>
                                <Upload {...props}>
                                    <Button>
                                        <Icon type="upload"/> Select File
                                    </Button>
                                </Upload>
                                <Button
                                    type="primary"
                                    onClick={this.onSubmit}
                                    disabled={fileList.length === 0}
                                    loading={uploading}
                                    style={{marginTop: 16}}
                                >
                                    {uploading ? 'Uploading' : 'Start Upload'}
                                </Button>
                            </div>
                        </div>
                        <TableSubmission challenge={challenge} user={this.props.auth.user.user_id}/>

                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        listChallenge: state.challenge.listChallenge,
        done: state.auth.done,
        token: state.auth.token,
    };
};

export default connect(mapStateToProps, {
    returnErrors, fetchSubmissionStaff
})(TestSubmission);


