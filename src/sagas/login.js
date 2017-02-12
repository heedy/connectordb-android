/*
This file contains all functionality related to logging in and logging out of ConnectorDB with the app.

Login is separated into two parts:
    - appLogin connects to the server, and prepares the phone device, making sure that everything is working.
    - deviceLogin connects to an existing device, setting up all the relevant streams. it then starts background data
        gathering, and loads all relevant streams into the UI
*/

import { Alert, ToastAndroid } from 'react-native';
import { put, takeEvery, select } from 'redux-saga/effects'
import semver from 'semver';
import { ConnectorDB } from 'connectordb';

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

function* failLogin(err) {
    yield put({ type: "LOAD_FINISHED", value: true });
    yield put({ type: "LOGIN_STATUS", value: "" });
    Alert.alert("Login Failed", err.toString());
}

// This function sets up the entire app on login. Pressing the login button 
export function* appLogin() {

    let login = yield select((state) => state.login);

    // This is the result that will be sent on to next part of login process
    let result = {
        url: login.server,
        user: login.username,
        apikey: ""  // apikey will be queried in a moment
    };

    if (login.username === "") {
        Alert.alert("Missing Information", "Please type in a username");
        return;
    }
    if (login.password === "") {
        Alert.alert("Missing Information", "Please type in a password");
        return;
    }
    if (login.devicename === "") {
        Alert.alert("Missing Information", "The Device name can't be blank");
        return;
    }
    if (login.devicename === "user" || login.devicename === "meta") {
        Alert.alert("Invalid Device Name", "The given device name is not permitted");
        return;
    }
    if (login.server === "") {
        Alert.alert("Missing Information", "A valid server URL is needed");
        return;
    }
    if (!login.server.startsWith("http")) {
        Alert.alert("Invalid Server URL", "A URL for the ConnectorDB server must start with http:// or https://.");
        return;
    }

    // Looks like the inputs are valid. Let's try to connect to the ConnectorDB server.

    // First, put the app back onto the loading screen.
    yield put({ type: "LOAD_FINISHED", value: false });

    // Set status to connecting
    yield put({ type: "LOGIN_STATUS", value: "Connecting to " + login.server });

    // Get the ConnectorDB version - we don't send the credentials yet, since we first want to make sure
    // that it is a ConnectorDB server we're connecting to.
    try {
        let version = (yield timeoutPromise(fetch(login.server + "/api/v1/meta/version").then((res) => res.text()), 5000));
        if (version == "0.3.0a1" || version == "0.3.0b1" || version.startsWith("0.3.0git")) {
            ToastAndroid.show("WARNING: You are connecting to an outdated ConnectorDB server (" + version + "). Some app features might not work.", ToastAndroid.LONG);
        } else {
            version = semver.valid(version);
            if (version == null) {
                yield failLogin("Could not read ConnectorDB version");
                return;
            }

            // In the future, the version can be checked here in detail
        }

    } catch (err) {
        yield failLogin(err);
        return;
    }

    // At this point, we're pretty sure that there is a ConnectorDB server at the other end, since it responded to 
    // our queries with an accepted version number... So let's try to log in, and create the phone's device.

    try {
        yield put({ type: "LOGIN_STATUS", value: "Authenticating" });
        let cdb = new ConnectorDB(login.username, login.password, login.server);

        // Check if twe can log in
        if ((yield cdb._doRequest("?q=this", "GET")).code !== undefined) {
            yield failLogin("Incorrect username or password");
            return;
        }

        // OK, our credentials were accepted. That means that we're good to go.

        // First: we get the apikey for the user device, so that we don't need to store the password
        result["apikey"] = (yield cdb.readDevice(login.username, "user")).apikey;



        // Create a device for the phone
        yield put({ type: "LOGIN_STATUS", value: "Setting up " + login.devicename + " device" });


    } catch (err) {
        yield failLogin(err);
        return;
    }



    yield put({ type: "DEVICE_LOGIN", value: result });


}

export function* deviceLogin(action) {
    // Set up the credentials. We're logged in
    yield put({ type: "SET_CREDENTIALS", value: action.value });

    // load the input and downlink streams
    yield put({ type: "REFRESH_INPUTS" });
    yield put({ type: "REFRESH_DOWNLINKS" });

    // ...and disable the loading screen.
    yield put({ type: "LOAD_FINISHED", value: true });
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export default function* loginSaga() {
    yield takeEvery('LOGIN', appLogin);
    yield takeEvery('DEVICE_LOGIN', deviceLogin);
}