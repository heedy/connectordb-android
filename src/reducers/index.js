import basicReducer from './basic';
import inputReducer from './input';
import downlinkReducer from './downlink';
import settingsReducer from './settings';
import errorReducer from './error';

const reducers = {
    basic: basicReducer,
    inputs: inputReducer,
    downlinks: downlinkReducer,
    settings: settingsReducer,
    error: errorReducer
};

export default reducers;