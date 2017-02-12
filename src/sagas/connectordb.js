/* All functions that access ConnectorDB are in this file */

import { put, takeEvery, select } from 'redux-saga/effects'

// The ConnectorDB library requires Buffer
global.Buffer = global.Buffer || require('buffer').Buffer;
import { ConnectorDB } from 'connectordb';

import { ToastAndroid } from 'react-native';

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

// This function wraps the promises of connectordb so that a failed login attempt gives the correct error message.
function cdbPromise(promise, ms = 5000) {
    return timeoutPromise(promise, ms).then(function (res) {
        if (res.ref !== undefined) {
            throw new Error(res.msg);
        }
        return res;
    });
}

export function* refreshDownlinks() {
    let cdb = yield select((state) => state.main.cdb);
    console.log("-----------------------------------------------");
    console.log(yield cdb.listStreams());
    console.log("HERE IS CDB", cdb);
    console.log("-----------------------------------------------");
    yield put({ type: 'DOWNLINK_REFRESHING', value: true });
    try {
        let username = yield select((state) => state.main.user);
        let streams = (yield cdbPromise(cdb.listUserStreams(username, "*", false, true, true))).map((s) => ({ ...s, schema: JSON.parse(s.schema) }));
        yield put({ type: 'UPDATE_DOWNLINKS', value: streams });
    } catch (err) {
        console.log(err);
        yield put({ type: "SHOW_ERROR", value: { text: err.toString(), color: "red" } })
    }
    yield put({ type: 'DOWNLINK_REFRESHING', value: false });
}

export function* refreshInputs() {
    let cdb = yield select((state) => state.main.cdb);
    yield put({ type: 'INPUT_REFRESHING', value: true });
    try {
        let username = yield select((state) => state.main.user);
        let streams = (yield cdbPromise(cdb.listStreams(username, "user"))).map((s) => ({ ...s, schema: JSON.parse(s.schema) }));
        yield put({ type: 'UPDATE_INPUTS', value: streams });
    } catch (err) {
        console.log(err);
        yield put({ type: "SHOW_ERROR", value: { text: err.toString(), color: "red" } });
    }
    yield put({ type: 'INPUT_REFRESHING', value: false });
}

export function* insertStream(action) {
    let cdb = yield select((state) => state.main.cdb);
    try {
        yield cdbPromise(cdb.insertNow(action.username, action.devicename, action.streamname, action.value));
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