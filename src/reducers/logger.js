export const LoggerInitialState = {
    gather: true,
    autosync: 20 *60,
    loggers: {},
    device: null,
    enabled: {}
};

export default function loggerReducer(state = LoggerInitialState, action) {
    switch (action.type) {
        case 'SET_GATHER':
            return {
                ...state,
                gather: action.value
            };
        case 'SET_LOGGERS':
            newenabled = Object.assign({}, state.enabled);
            Object.keys(action.value).map((key) => {
                if (newenabled[key] === undefined) {
                    newenabled[key] = true;
                }
            });
            return {
                ...state,
                loggers: action.value,
                enabled: newenabled
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
        case 'SET_ENABLED':
            newval = Object.assign({}, state.enabled);
            newval[action.key] = action.value;
            return {
                ...state,
                enabled: newval
            }
    }
    return state;
}
