import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import ChallengeCard from "./ChallengeCard";
import {CreateChallenge} from "./CreateChallenge";

class CourseList extends Component {
    static propTypes = {
        listCourse: PropTypes.array.isRequired,
        listChallenge: PropTypes.array.isRequired,

    };


    render() {

        return (<div>
            {this.renderList()}

        </div>)
    };


    renderList() {
        return this.props.listCourse.map((course) => {
            return (
                <div id="accordion">
                    <h3> {course.description}</h3>
                    {
                        this.props.listChallenge.filter(function (challenge) {
                            return challenge.course === course.course_id;
                        }).map((challenge) => {
                            return (
                                renderCard(challenge)
                                )
                            }
                        )
                    }
                </div>)


        })
    }
}


const renderCard= (challenge)=>{
    return <div className="card">
                                <div className="card-header" id="headingOne">
                                    <h5 className="mb-0">
                                        <button className="btn btn-link" data-toggle="collapse"
                                                data-target={'#collapse'+challenge.challenge_id}  aria-expanded="false"
                                                aria-controls={'collapse'+challenge.challenge_id} >
                                            Challenge: {challenge.description}
                                        </button>
                                    </h5>
                                </div>

                                <div id={'collapse'+challenge.challenge_id} className="collapse" aria-labelledby="headingOne"
                                     data-parent="#accordion">
                                    <div className="card-body">
                                        <ChallengeCard key={challenge.challenge_id} challenge={challenge}/>
                                    </div>
                                </div>
                            </div>
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        listCourse: state.application.listCourse,
        listChallenge: state.application.listChallenge
    };
};

export default connect(mapStateToProps)(CourseList);
