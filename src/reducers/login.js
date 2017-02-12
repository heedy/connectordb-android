const InitialState = {
    username: "",
    password: "",
    server: "https://connectordb.com",
    devicename: "phone",
    localnetwork: false,
    status: ""
};

export default function mainReducer(state = InitialState, action) {
    switch (action.type) {
        case 'SET_LOGIN':
            return {
                ...state,
                ...action.value
            };
        case 'LOGIN_STATUS':
            return {
                ...state,
                status: action.value
            };
        case 'LOGOUT':
            return InitialState;
    }
    return state;
}