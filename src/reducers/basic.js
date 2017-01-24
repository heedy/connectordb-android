const InitialState = {
    test: false
};

export default function basicReducer(state = InitialState, action) {
    switch (action.type) {
        case 'BASIC_TEST':
            return {
                ...state,
                test: true
            };
        case 'BASIC_TEST_END':
            return {
                ...state,
                test: false
            };
    }
    return state;
}