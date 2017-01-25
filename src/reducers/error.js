const InitialState = {
    text: "",
    color: "red"
};

export default function reducer(state = InitialState, action) {
    switch (action.type) {
        case 'SET_ERROR_VALUE':
            return action.value
    }
    return state;
}