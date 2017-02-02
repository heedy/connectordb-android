const InitialState = {
    test: false,
    url: "http://10.0.2.2:3124",
    user: "test",
    apikey: "2911e03a-e0ef-4e8c-6515-dd3bfdb24174"
};

export default function mainReducer(state = InitialState, action) {
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