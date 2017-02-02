import mainReducer from './main';
import inputReducer from './input';
import downlinkReducer from './downlink';
import settingsReducer from './settings';
import errorReducer from './error';

const reducers = {
    main: mainReducer,
    inputs: inputReducer,
    downlinks: downlinkReducer,
    settings: settingsReducer,
    error: errorReducer
};

export default reducers;