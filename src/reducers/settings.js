const InitialState = {
    loggers: {},
    sync: {
        enabled: false,
        ssid: ""
        //time: 20 * 60
    }
};

export default function reducer(state = InitialState, action) {
    switch (action.type) {
        case 'SET_LOGGERS':
            return {
                ...state,
                loggers: action.value
            };
        case 'INIT_SYNC':
            return {
                ...state,
                sync: action.value
            };
        case 'SET_SYNC_ENABLED':
            return {
                ...state,
                sync: {
                    ...state.sync,
                    enabled: action.value
                }
            };
        case 'SET_SSID':
            return {
                ...state,
                sync: {
                    ...state.sync,
                    ssid: action.value
                }
            };
        case 'LOGGER_ENABLED':
            let newState = {
                ...state,
                loggers: {
                    ...state.loggers,
                }
            };
            newState.loggers[action.key] = { ...state.loggers[action.key], enabled: action.value };
            return newState;
    }
    return state;
}