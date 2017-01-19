import loginReducer from './login';
import appReducer from './app';
import loggerReducer from './logger';

export const reducers = {
    app: appReducer,
    login: loginReducer,
    logger: loggerReducer
}
