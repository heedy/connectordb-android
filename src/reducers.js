/*
	This file contains the state modifiers for redux. Everything that can happen to modify the state of the app goes through here
*/

import InitialState from './initialstate'

import {LOAD, SAVE,} from 'redux-storage';

// stateLoader loads the appState from the saved properties
export function stateLoader(store, state) {}

// Reducer performs state modifications for the full app.
export default function Reducer(state = InitialState, action) {
    if (action.type == LOAD) {
        // This happens when we load the app state
        return {
            ...state,
            loaded: true,
            app: {
                username_textbox: state.auth.username,
                password_textbox: "",
                device_textbox: state.auth.device,
                server_textbox: state.auth.server,
            }
        };
    }

    if (action.type == SAVE) {
        // Ignore saves
        return state;
    }
    // If not load or save, say what it is:
    if (action.type == 'APP_SET_PASSWORD') {
        console.log({type: 'APP_SET_PASSWORD', value: "*****",});
    } else {
        console.log(action);
    }

    switch (action.type) {
        case 'SET_GATHER':
            return {
                ...state,
                gather: action.value,
            };

        case 'APP_SET_SERVER':
            return {
                ...state,
                app: {
                    ...state.app,
                    server_textbox: action.value,
                },
            };
        case 'APP_SET_PASSWORD':
            return {
                ...state,
                app: {
                    ...state.app,
                    password_textbox: action.value,
                },
            };
        case 'APP_SET_USERNAME':
            return {
                ...state,
                app: {
                    ...state.app,
                    username_textbox: action.value,
                },
            };
        case 'APP_SET_DEVICE':
            return {
                ...state,
                app: {
                    ...state.app,
                    device_textbox: action.value,
                },
            };

        default:
            return state;
    }
}
