import mainReducer from './main';
import inputReducer from './input';
import downlinkReducer from './downlink';
import settingsReducer from './settings';
import errorReducer from './error';
import loginReducer from './login';

const reducers = {
    main: mainReducer,
    inputs: inputReducer,
    downlinks: downlinkReducer,
    settings: settingsReducer,
    error: errorReducer,
    login: loginReducer
};

export default reducers;