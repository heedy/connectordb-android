const InitialState = {
    refreshing: false,
    streams: [],
    error: ""
};

export default function reducer(state = InitialState, action) {
    switch (action.type) {
        case 'DOWNLINK_REFRESHING':
            return {
                ...state,
                refreshing: action.value
            };
        case 'UPDATE_DOWNLINKS':
            return {
                ...state,
                streams: action.value
            };
        case 'LOGOUT':
            return InitialState;
    }
    return state;
}