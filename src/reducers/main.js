const InitialState = {
    url: "",
    user: "",
    apikey: "",     // The main api key that gives access to the ratings and such
    dapikey: "",    // The API key that gives write access to the device in which we log data.
    cdb: null,      // This holds the logged-in ConnectorDB object
    loaded: false   // This becomes true when the relevant data is loaded from app storage
};

import { ConnectorDB } from 'connectordb';

export default function mainReducer(state = InitialState, action) {
    switch (action.type) {
        case 'LOAD_FINISHED':
            return {
                ...state,
                loaded: (action.value !== undefined ? action.value : true)
            };
        case 'SET_CREDENTIALS':
            let newstate = {
                ...state,
                ...action.value,
            };
            newstate.cdb = new ConnectorDB(newstate.apikey, undefined, newstate.url);
            return newstate;
        case 'LOGOUT':
            return { ...InitialState, loaded: true };
    }
    return state;
}