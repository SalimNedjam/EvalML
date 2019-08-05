import React, {Component} from "react";
import axios from 'axios'

export class SendEmail extends Component {

    state = {
        message: "",
        subject: "",


    };

    onSubmit = e => {
        e.preventDefault();
        const {message, subject} = this.state;
        if (subject === "")
            this.props.createMessage({isEmptyTitle: "L'objet ne peut pas etre vide"});
        else if (message === "")
            this.props.createMessage({isEmptyTitle: "Le message ne peut pas etre vide"});

        else {
            const mailToSend = {
                message,
                subject,
                course_id: this.props.course,
            }

            this.sendEmail(mailToSend);
        }
    };

    onChange = e => this.setState({[e.target.name]: e.target.value});


    sendEmail({message, subject, course_id}) {
        const token = this.props.token
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        config.headers["Authorization"] = `Token ${token}`;
        const body = JSON.stringify({message, subject, course_id});


        axios.post('/api/course/send_email', body, config)
            .then(res => {
                this.props.createMessage({addUser: "Le message a bien été envoyé"})
                this.setState({
                    message: "",
                    subject: "",
                })
            }).catch(err => {
        })
    }

    render() {

        const {message, subject} = this.state;
        return (

            <form onSubmit={this.onSubmit}>
                <h5 className="text-center">Send email to all student of this course</h5>

                <div className="form-group">
                    <label>Objet</label>
                    <input
                        type="text"
                        className="form-control"
                        name="subject"
                        onChange={this.onChange}
                        value={subject}
                    />
                </div>

                <div className="form-group">
                    <label>Message</label>
                    <textarea
                        className="form-control"
                        name="message"
                        onChange={this.onChange}
                        value={message}
                    />
                </div>

                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Envoyer le message
                    </button>
                </div>

            </form>
        );
    }
}

