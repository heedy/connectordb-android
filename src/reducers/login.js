const InitialState = {
    username: "",
    password: "",
    server: "https://connectordb.com",
    devicename: "phone",
    localnetwork: true
};

export default function mainReducer(state = InitialState, action) {
    switch (action.type) {
        case 'SET_LOGIN':
            return {
                ...state,
                ...action.value
            };
    }
    return state;
}