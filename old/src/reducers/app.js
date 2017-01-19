export const AppInitialState = {

    // whether or not the user is currently logged in
    loggedIn: false,

    user: null,
    device: null,
    server: ""
}

export default function appReducer(state = AppInitialState, action) {
    switch (action.type) {
        case 'SET_LOGGED_IN':
            return {
                ...state,
                loggedIn: action.value
            }
        case 'SET_USER':
            return {
                ...state,
                user: action.value
            };
        case 'SET_DEVICE':
            return {
                ...state,
                device: action.value
            };
        case 'SET_SERVER':
            return {
                ...state,
                server: action.value
            }
    }
    return state;
}
