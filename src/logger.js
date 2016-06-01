import {NativeModules} from 'react-native';

var Logger = NativeModules.Logger;

export function getSettingSchemas() {
    return Logger.getSettingSchemas();
}

export default Logger;
