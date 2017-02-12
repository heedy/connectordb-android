const InitialState = {
    url: "",
    user: "",
    apikey: "",
    cdb: null,  // This holds the logged-in ConnectorDB object
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
    }
    return state;
}