import {NativeModules} from 'react-native';

var Logger = NativeModules.Logger;

export function setGather(value) {
    Logger.setGather(value);
    return {type: "SET_GATHER", value: value}
}
export function setSync(value) {
    Logger.setSync(value);
    return {type: "SET_AUTOSYNC", value: value}
}

export function getLoggers() {
    return (dispatch) => {
        Logger.getLoggers().then((result) => {
            dispatch({type: "SET_LOGGERS", value: result});
        });
    }

}
