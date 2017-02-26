const InitialState = {
    loggers: {}
};

export default function reducer(state = InitialState, action) {
    switch (action.type) {
        case 'SET_LOGGERS':
            return {
                ...state,
                loggers: action.value
            };
    }
    return state;
}