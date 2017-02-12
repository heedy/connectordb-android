
import basicSaga from './basic';
import connectordbSaga from './connectordb';
import loginSaga from './login';
import storageSaga from './storage';

export default function* sagas() {
    yield [
        basicSaga(),
        connectordbSaga(),
        loginSaga(),
        storageSaga()
    ];
}