import {NativeModules} from 'react-native';

/**
Logger has the following methods defined:
clear() - removes all data from the cache
length() - (promise) gets the number of datapoints currently cached
sync() - synchronizes with connectordb
setCred(server,devicename,apikey) - sets the credentials to use for synchronization
setSyncTime(time) - sets the time in seconds between auto-sync attempts. -1 means disable autosync
                    Note: While the google fit issue in GoogleFitLogger.java is not fixed, a time of ~20 minutes should
                    be hard-coded.  This is to avoid dataloss from google fit.
setEnabled(key,bool) - sets the enabled state of the given logger
getLoggers() - promise returns a map of all available loggers.
**/
var Logger = NativeModules.Logger;
export default Logger;

export function setEnabled(key, value) {
    console.log("Setting enabled", key, value);
    Logger.setEnabled(key, value);
    return {type: "SET_ENABLED", key: key, value: value}
}
export function setSync(value) {
    Logger.setSyncTime(value);
    return {type: "SET_AUTOSYNC", value: value}
}

export function getLoggers() {
    return (dispatch) => {
        Logger.getLoggers().then((result) => {
            dispatch({type: "SET_LOGGERS", value: result});
        });
    }

}

export function sync() {
    Logger.sync();
    return {type: "NOP"};
}
