export const LoginInitialState = {
    username: "",
    password: "",
    device: "phone",
    server: "https://connectordb.com",

    loggerDeviceInitializer: {
        description: "Android data logging app"
    }
};

export default function loginReducer(state = LoginInitialState, action) {
    switch (action.type) {
        case 'login/RESET':
            return LoginInitialState;
        case 'login/SET_SERVER':
            return {
                ...state,
                server: action.value
            };
        case 'login/SET_PASSWORD':
            return {
                ...state,
                password: action.value
            };
        case 'login/SET_USERNAME':
            return {
                ...state,
                username: action.value
            };
        case 'login/SET_DEVICE':
            return {
                ...state,
                device: action.value
            }
    }
    return state;
}
