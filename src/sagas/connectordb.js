/* All functions that access ConnectorDB are in this file */

import { put, takeEvery, select } from 'redux-saga/effects'

// The ConnectorDB library requires Buffer
global.Buffer = global.Buffer || require('buffer').Buffer;
import { ConnectorDB } from 'connectordb';

import { ToastAndroid } from 'react-native';

let cdb = new ConnectorDB("test", "test", "http://10.0.2.2:3124")

// https://github.com/github/fetch/issues/175 - copied from comment by nodkz
function timeoutPromise(promise, ms = 5000) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error("Could not connect to ConnectorDB"))
        }, ms);
        promise.then(
            (res) => {
                clearTimeout(timeoutId);
                resolve(res);
            },
            (err) => {
                clearTimeout(timeoutId);
                reject(err);
            }
        );
    })
}

export function* refreshDownlinks() {
    yield put({ type: 'DOWNLINK_REFRESHING', value: true });
    try {
        console.log("GETTING USER");
        let u = yield timeoutPromise(cdb.readUser("tree"));
        if (u.msg !== undefined) throw u.msg;
        yield put({ type: 'UPDATE_DOWNLINKS', value: u });
    } catch (err) {
        console.log(err);
        yield put({ type: "SHOW_ERROR", value: { text: err.toString(), color: "red" } })
    }
    yield put({ type: 'DOWNLINK_REFRESHING', value: false });
}

export function* refreshInputs() {
    yield put({ type: 'INPUT_REFRESHING', value: true });
    try {
        let username = yield select((state) => state.main.user);
        let streams = (yield timeoutPromise(cdb.listStreams(username, "user"))).map((s) => ({ ...s, schema: JSON.parse(s.schema) }));
        yield put({ type: 'UPDATE_INPUTS', value: streams });
    } catch (err) {
        console.log(err);
        yield put({ type: "SHOW_ERROR", value: { text: err.toString(), color: "red" } });
    }
    yield put({ type: 'INPUT_REFRESHING', value: false });
}

export function* insertStream(action) {
    try {
        yield timeoutPromise(cdb.insertNow(action.username, action.devicename, action.streamname, action.value));
        ToastAndroid.show("Inserted " + String(action.value), ToastAndroid.SHORT);
    } catch (err) {
        console.log(err);
        yield put({ type: "SHOW_ERROR", value: { text: err.toString(), color: "red" } });
    }
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export default function* connectordbSaga() {
    yield takeEvery('INSERT_STREAM', insertStream);
    yield takeEvery('REFRESH_DOWNLINKS', refreshDownlinks);
    yield takeEvery('REFRESH_INPUTS', refreshInputs);
}