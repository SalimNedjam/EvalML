import React, {Component} from 'react';

export default class SignIn extends Component {

    render() {
        return (
            <div>

                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                   aria-expanded="false"> <span className="caret">Profile</span></a>

                <form className="dropdown-menu dropdown-menu-right" style={{"margin-right": "10px"}}>
                    <a className="dropdown-item" href="#">My profile</a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#">Logout</a>
                </form>
            </div>

        )

    }

}



