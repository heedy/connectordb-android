package com.connectordb_android;

import android.util.Log;
import android.widget.Toast;

import com.connectordb_android.logger.BaseLogger;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.util.Iterator;

public class LoggerModule extends ReactContextBaseJavaModule {
    public LoggerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    }

    @Override
    public String getName() {
        return "Logger";
    }

    /**
     * getSettingSchemas returns a map of the json schemas used for setting up individual logger
     * properties. The json schemas are all strings that can be parsed.
     * NOTE: The reason they are strings is because I don't want to deal with java maps for this.
     * @param promise a promise which returns a map os string json schemas.
     */
    @ReactMethod
    public void getSettingSchemas(Promise promise) {
        WritableMap settings = Arguments.createMap();
        Iterator<BaseLogger> iter = BaseLogger.loggerlist.iterator();
        while (iter.hasNext()) {
            BaseLogger l = iter.next();
            Log.d("Add Schema",l.name+":"+l.getSettingSchema());
            settings.putString(l.name,l.getSettingSchema());
        }
        promise.resolve(settings);
    }
}
