/*
 This file handles the storage of all relevant values. All credentials and app settings are stored asynchronously here.
*/

import { AsyncStorage } from 'react-native';
import { put, takeEvery, select, call } from 'redux-saga/effects'

const CREDENTIALS = '@CDB:credentials';
const INPUTS = '@CDB:inputs';
const DOWNLINKS = '@CDB:downlinks';

// Loads all of the data that is stored in storage. This function initializes the app from a cold-boot.
function* loadStorage() {
    // First, load the credentials if such exist
    try {
        let cred = yield call(AsyncStorage.getItem, CREDENTIALS);

        // Set up the credentials
        if (cred != null) {
            cred = JSON.parse(cred);

            yield put({ type: "SET_CREDENTIALS", value: cred, storage: false });



            if (cred.apikey !== undefined && cred.apikey != "") {
                // There is an API key. Try loading the inputs and downlinks
                let inputs = yield call(AsyncStorage.getItem, INPUTS);
                if (inputs != null)
                    yield put({ type: "UPDATE_INPUTS", value: JSON.parse(inputs), storage: false });
                let downlinks = yield call(AsyncStorage.getItem, DOWNLINKS);
                if (downlinks != null)
                    yield put({ type: "UPDATE_DOWNLINKS", value: JSON.parse(downlinks), storage: false });
            }

        }
    } catch (error) {
        // If there is an error, we don't do anything. It means that the app is simply uninitialized
    }
    // The app is finished with initial loading, so hide the loading screen
    yield put({ type: "LOAD_FINISHED" });
}

function* updater(action, key) {
    if (action.storage !== undefined && !action.storage) {
        return; // We don't want to store things that were called from storage code.
    }
    yield call(AsyncStorage.setItem, key, JSON.stringify(action.value));
}

// Every time new credentials are stored, we also update the storage. This tries to merge the data first.
function* setCredentials(action) {
    if (action.storage !== undefined && !action.storage) {
        return; // We don't want to store things that were called from storage code.
    }
    try {
        yield call(AsyncStorage.mergeItem, CREDENTIALS, JSON.stringify(action.value));
    } catch (error) {
        yield call(AsyncStorage.setItem, CREDENTIALS, JSON.stringify(action.value));
    }
}

// Same for inputs and downlinks
function* updateInputs(action) {
    yield* updater(action, INPUTS);
}
function* updateDownlinks(action) {
    yield* updater(action, DOWNLINKS);
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export default function* storageSaga() {
    yield takeEvery('LOAD_STORAGE', loadStorage);


    yield takeEvery('SET_CREDENTIALS', setCredentials);
    yield takeEvery('UPDATE_INPUTS', updateInputs);
    yield takeEvery('UPDATE_DOWNLINKS', updateDownlinks);
}