/* All functions that access ConnectorDB are in this file */

import { put, takeEvery, select } from 'redux-saga/effects'

// The ConnectorDB library requires Buffer
global.Buffer = global.Buffer || require('buffer').Buffer;
import { ConnectorDB } from 'connectordb';

let cdb = new ConnectorDB("test", "test", "http://10.0.2.2:8000")

export function* refreshDownlinks() {
    yield put({ type: 'DOWNLINK_REFRESHING', value: true });
    try {
        let u = yield cdb.readUser("test");
        yield put({ type: 'UPDATE_DOWNLINKS', value: u });
    } catch (err) {
        console.log(err);
    }
    yield put({ type: 'DOWNLINK_REFRESHING', value: false });
}

export function* refreshInputs() {
    yield put({ type: 'INPUT_REFRESHING', value: true });
    try {
        let streams = yield cdb.listStreams("test", "user");
        yield put({ type: 'UPDATE_INPUTS', value: streams });
    } catch (err) {
        console.log(err);
    }
    yield put({ type: 'INPUT_REFRESHING', value: false });
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export default function* connectordbSaga() {
    yield takeEvery('REFRESH_DOWNLINKS', refreshDownlinks);
    yield takeEvery('REFRESH_INPUTS', refreshInputs);
}