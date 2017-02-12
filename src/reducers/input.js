const InitialState = {
    refreshing: false,
    streams: [],
    error: { text: "", color: "red" }
};

export default function reducer(state = InitialState, action) {
    switch (action.type) {
        case 'INPUT_REFRESHING':
            return {
                ...state,
                refreshing: action.value
            };
        case 'UPDATE_INPUTS':
            return {
                ...state,
                streams: action.value
            };
        case 'LOGOUT':
            return InitialState;
    }
    return state;
}