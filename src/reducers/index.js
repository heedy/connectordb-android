import basicReducer from './basic';
import inputReducer from './input';
import downlinkReducer from './downlink';
import settingsReducer from './settings';

const reducers = {
    basic: basicReducer,
    inputs: inputReducer,
    downlinks: downlinkReducer,
    settings: settingsReducer
};

export default reducers;