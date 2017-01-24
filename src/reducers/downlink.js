const InitialState = {
    refreshing: false,
    streams: []
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
    }
    return state;
}