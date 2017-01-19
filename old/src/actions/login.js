import {ConnectorDB} from 'connectordb';
import {Alert} from 'react-native';

import Logger, {setSync} from './logger';

function failAlert(msg, dispatch) {
    dispatch({type: "login/SET_PASSWORD", value: ""});
    Alert.alert('Failed to log in', msg.msg);
}

// login performs a full login from the login screen. It is assumed that the app
// is currently not logged in, and is on the login screen.
export default function login(loginState) {
    return (dispatch) => {
        console.log("Logging in as", loginState.username, "to server", loginState.server);
        var cdb = new ConnectorDB(loginState.username, loginState.password, loginState.server);
        cdb.readDevice(loginState.username + "/user").then((result) => {
            console.log("Query device", result);
            if (result.ref !== undefined) {
                failAlert(result, dispatch);
                return null;
            }
            dispatch({type: "SET_DEVICE", value: result});
            if (result.apikey === undefined || result.apikey == "") {
                Alert.alert('No API key was given - ConnectorDB is not set up properly.');
                return null;
            }

            // Now we check that the api key works by querying the user
            cdb = new ConnectorDB(result.apikey, undefined, loginState.server);
            return cdb.readUser(loginState.username);

        }).then((result) => {
            if (result == null) {
                return null
            }
            console.log("Query user", result);
            if (result.ref !== undefined) {
                failAlert(result, dispatch);
                return null;
            }
            dispatch({type: "SET_USER", value: result});

            // Now see if the phone device exists
            return cdb.readDevice(loginState.username + "/" + loginState.device);
        }).then((result) => {
            if (result == null) {
                return null
            }
            console.log("Checking if device exists", result);
            if (result.ref !== undefined) {
                // The device doesn't exist - create it!
                return cdb.createDevice(loginState.username, {
                    ...loginState.loggerDeviceInitializer,
                    name: loginState.device
                })
            } else {
                return new Promise((resolve, reject) => {
                    Alert.alert("Device Exists", "This device already exists. Overwrite?", [
                        {
                            text: 'Cancel',
                            onPress: () => resolve({ref: "NOPE", msg: "Device Exists"})
                        }, {
                            text: 'OK',
                            onPress: () => resolve(result)
                        }
                    ]);
                });
            }
        }).then((result) => {
            if (result == null) {
                return null
            }
            console.log("SET LOGGER DEVICE", result);
            if (result.ref !== undefined) {
                failAlert(result, dispatch);
                return null;
            }

            // Set up the logger
            Logger.setCred(loginState.server, loginState.username + "/" + loginState.device, result.apikey);
            dispatch(setSync(60 * 20)); //Set sync to 20 minutes

            dispatch({type: "SET_LOGGER_DEVICE", value: result});
            dispatch({type: "login/RESET"});
            dispatch({type: "SET_LOGGED_IN", value: true});

        })
    }
}

export function logout() {
    return (dispatch) => {
        dispatch(setSync(-1));
        Logger.setCred("", "", "");
        dispatch({type: "SET_LOGGED_IN", value: false});
        dispatch({type: "SET_LOGGER_DEVICE", value: null});
        dispatch({type: "SET_USER", value: null});
        dispatch({type: "SET_DEVICE", value: null});
    }
}
