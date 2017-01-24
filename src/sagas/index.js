
import basicSaga from './basic';

import connectordbSaga from './connectordb';

export default function* sagas() {
    yield [
        basicSaga(),
        connectordbSaga()
    ];
}