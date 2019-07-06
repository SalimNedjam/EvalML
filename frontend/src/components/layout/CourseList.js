import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";

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
                <div id="accordion" key={course.course_id}>
                    <h3 className="text-center"
                        style={{marginTop: "20px", marginBottom: "20px"}}> {course.description}</h3>
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


const renderCard = (challenge) => {
    return <div className="card" key={challenge.challenge_id} style={{marginTop: "10px", marginBottom: "10px"}}>
        <div className="card-header" id="headingOne">
            <h5 className="mb-0">
                <button className="btn btn-link" data-toggle="collapse"
                        data-target={'#collapse' + challenge.challenge_id} aria-expanded="false"
                        aria-controls={'collapse' + challenge.challenge_id}>
                    Challenge: {challenge.description}
                </button>
            </h5>
        </div>

        <div id={'collapse' + challenge.challenge_id} className="collapse" aria-labelledby="headingOne"
             data-parent="#accordion">
            <div className="highlight-clean">
                <div className="container">
                    <div className="intro" style={styleContainer}>
                        <h2 className="text-center">{challenge.title}</h2>
                        <p className="text-center">{challenge.description}</p>
                        <button
                            className="btn btn-outline-primary text-uppercase text-center"
                            type="button" style={styleButton}>
                            GET INFORMATIONS
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
}

var styleButton = {
    "marginLeft": "auto",
    "fontWeight": "bold",
    "fontSize": "14px",
    "marginBottom": "20px"
}
var styleContainer = {
    textAlign: "center"
}


const mapStateToProps = (state) => {
    console.log(state)
    return {
        listCourse: state.application.listCourse,
        listChallenge: state.application.listChallenge
    };
};

export default connect(mapStateToProps)(CourseList);
