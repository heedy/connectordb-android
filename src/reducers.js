/*
	This file contains the state modifiers for redux. Everything that can happen to modify the state of the app goes through here
*/

import {InitialState} from './initialstate'

// Reducer performs state modifications for the full app.
export default function Reducer(state = InitialState, action) {
    switch (action.type) {
        case 'SET_GATHER':
            return Object.assign({}, state, {gather: action.value});
        default:
            return state;
    }
}
