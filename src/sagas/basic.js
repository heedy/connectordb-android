import { delay } from 'redux-saga'
import { put, takeEvery } from 'redux-saga/effects'

// Our worker Saga: will perform the async increment task
export function* basicAction() {
    yield delay(1000);
    yield put({ type: 'BASIC_TEST' });
    yield delay(1000);
    yield put({ type: 'BASIC_TEST_END' });
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export default function* basicSaga() {
    yield takeEvery('INCREMENT_ASYNC', basicAction);
}