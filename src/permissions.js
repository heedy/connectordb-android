/**
 * Android requires special permission management in order to enable full gathering of data.
 * This allows us to show permissions requests each time the app is started.
 * 
 * If the user disables a permission, the next time they start the app, the permission will be requested again.
 * We can't be clever about the permissions, and must request them all at once, because we access the
 * phone data in the background.
 */

import { PermissionsAndroid, Alert } from 'react-native';

async function requestAppPermissions() {
    try {
        const granted = await PermissionsAndroid.requestMultiple([
            /**
             * ADD YOUR PERMISSION HERE
             * 
             * Only add it if it is considered a dangerous permission!
             * https://developer.android.com/guide/topics/permissions/requesting.html#normal-dangerous
             * 
             * Otherwise, android will automatically grant it, and there is no need to worry!
             */
            'android.permission.ACCESS_FINE_LOCATION',
            'android.permission.BODY_SENSORS'
        ]);

        Object.keys(granted).map((k) => {
            if (granted[k] != PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert("Permissions Error",
                    `ConnectorDB was not able to obtain ${k}. 
                
                Some background streams might not gather data.`);
            } else {
                //console.log("Permission " + k + " granted");
            }
        });

    } catch (err) {
        Alert.alert("Permissions Error",
            "Asking for data gathering permissions failed: " + err.toString());
    }
}

export default requestAppPermissions;