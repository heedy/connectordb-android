
export function basicTest() {
    return { type: "INCREMENT_ASYNC" };
}

export function queryUser(u) {
    return { type: "QUERY_USER", user: u };
}

export function refreshDownlinks() {
    return { type: "REFRESH_DOWNLINKS" };
}

export function refreshInputs() {
    return { type: "REFRESH_INPUTS" };
}

export function insert(username, devicename, streamname, data) {
    return {
        type: "INSERT_STREAM",
        username: username,
        devicename: devicename,
        streamname: streamname,
        value: data
    };
}

export function setLogin(value) {
    return {
        type: "SET_LOGIN",
        value: value
    };
}

export function login() {
    return { type: "LOGIN" };
}

export function logout() {
    return { type: "LOGOUT" };
}


import * as loggers from '../logging';
import { ToastAndroid } from 'react-native';

export function setLoggerEnabled(key, value) {
    loggers.setEnabled(key, value);
    return { type: "LOGGER_ENABLED", value: value, key: key };
}

export function sync() {
    ToastAndroid.show("Syncing...", ToastAndroid.SHORT);
    loggers.sync();
    return { type: "SYNC" };
}

export function bgSync(enabled) {
    // We temporarily use a constant time. TODO: make this a user-accessible function
    return { type: "SET_SYNC_ENABLED", value: enabled };
}

export function setSSID(enabled) {
    // If enabled, we set the SSID to the current SSID
    if (enabled) {
        return { type: "SET_CURRENT_SSID" };
    } else {
        return { type: "SET_SSID", value: "" };
    }
}