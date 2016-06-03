export const LoggerInitialState = {
    gather: true,
    autosync: true,
    loggers: {},
    device: null
};

export default function loggerReducer(state = LoggerInitialState, action) {
    switch (action.type) {
        case 'SET_GATHER':
            return {
                ...state,
                gather: action.value
            };
        case 'SET_LOGGERS':
            return {
                ...state,
                loggers: action.value
            };
        case 'SET_LOGGER_DEVICE':
            return {
                ...state,
                device: action.value
            };
        case 'SET_AUTOSYNC':
            return {
                ...state,
                autosync: action.value
            };
    }
    return state;
}
