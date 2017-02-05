const InitialState = {
    url: "",
    user: "",
    apikey: "",
    loaded: false   // This becomes true when the relevant data is loaded from app storage
};

export default function mainReducer(state = InitialState, action) {
    switch (action.type) {
        case 'LOAD_FINISHED':
            return {
                ...state,
                loaded: true
            };
        case 'SET_CREDENTIALS':
            return {
                ...state,
                ...action.value
            };
    }
    return state;
}