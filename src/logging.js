import { NativeModules } from 'react-native';

/**
ConnectorDBLogger has the following methods defined:
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
var Logger = NativeModules.ConnectorDBLogger;

console.log(Logger);

export function setEnabled(key, value) {
    Logger.setEnabled(key, value);
}
export function setSync(value) {
    Logger.setSyncTime(value);
}

export function getLoggers() {
    return Logger.getLoggers();
}

export function sync() {
    Logger.sync();
}