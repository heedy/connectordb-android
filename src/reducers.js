/*
	This file contains the state modifiers for redux. Everything that can happen to modify the state of the app goes through here
*/

import InitialState from './initialstate'

import {LOAD, SAVE,} from 'redux-storage';

// Reducer performs state modifications for the full app.
export default function Reducer(state = InitialState, action) {
    if (action.type == LOAD) {
        return {
            ...state,
            loaded: true,
        };
    }

    if (action.type == SAVE) {
        // Ignore saves
        return state;
    }
    // If not load or save, say what it is:
    console.log(action);
    switch (action.type) {
        case 'SET_GATHER':
            return {
                ...state,
                gather: action.value,
            };
        default:
            return state;
    }
}
