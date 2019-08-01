import {
    ADD_CHALLENGE,
    ADD_CHALLENGE_FAIL,
    FETCH_CHALLENGES,
    REMOVE_CHALLENGE,
    SWITCH_GROUP_EDIT,
    SWITCH_SUBMISSION_DELETE,
    SWITCH_VISIBILITY
} from "../actions/types";

const initialState = {
    listChallenge: [],


};


export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_CHALLENGES:
            return {
                ...state,
                listChallenge: action.payload
            };

        case ADD_CHALLENGE:

            return {
                ...state,
                listChallenge: [...state.listChallenge, action.payload]
            }
        case REMOVE_CHALLENGE:
            return {
                ...state,
                listChallenge: state.listChallenge.filter(challenge => challenge.challenge_id != action.payload)
            }
        case SWITCH_VISIBILITY:
            return {
                ...state,
                listChallenge: state.listChallenge.map(challenge => {
                    if (challenge.challenge_id == action.payload.challenge_id) {
                        challenge.is_visible = action.payload.is_visible;
                    }
                    return challenge
                })
            }

        case SWITCH_GROUP_EDIT:
            return {
                ...state,
                listChallenge: state.listChallenge.map(challenge => {
                    if (challenge.challenge_id == action.payload.challenge_id) {
                        challenge.enable_edit_group = action.payload.enable_edit_group;
                    }
                    return challenge
                })
            }
        case SWITCH_SUBMISSION_DELETE:
            return {
                ...state,
                listChallenge: state.listChallenge.map(challenge => {
                    if (challenge.challenge_id == action.payload.challenge_id) {
                        challenge.enable_delete_submission = action.payload.enable_delete_submission;
                    }
                    return challenge
                })
            }
        case ADD_CHALLENGE_FAIL:
            return state;
        default:
            return state;
    }
}
