import { delay } from 'redux-saga'
import { put, takeLatest } from 'redux-saga/effects'

function* showError(action) {
    yield put({ type: 'SET_ERROR_VALUE', value: action.value });
    yield delay(5000);
    yield put({ type: 'SET_ERROR_VALUE', value: null });
}

import { getSSID, setSyncSSID } from '../logging.js';

function* setCurrentSSID(action) {
    s = yield getSSID();
    yield put({ type: "SET_SSID", value: s });
}

function* setSSID(action) {
    yield setSyncSSID(action.value);
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export default function* basicSaga() {
    yield takeLatest('SHOW_ERROR', showError);
    yield takeLatest('SET_SSID', setSSID);
    yield takeLatest('SET_CURRENT_SSID', setCurrentSSID);
}