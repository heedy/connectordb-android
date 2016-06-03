package com.connectordb_android;

import android.util.Log;
import android.widget.Toast;

import com.connectordb_android.logger.BaseLogger;
import com.connectordb_android.logger.LoggingManager;
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
     * getLoggers returns the logger stream information
     * @param promise a promise which returns a map of the logger streams
     */
    @ReactMethod
    public void getLoggers(Promise promise) {
        WritableMap settings = Arguments.createMap();
        Iterator<BaseLogger> iter = LoggingManager.get().loggers.iterator();
        while (iter.hasNext()) {
            BaseLogger l = iter.next();
            Log.d("Add Logger",l.name);

            WritableMap stream = Arguments.createMap();
            stream.putString("nickname",l.nickname);
            stream.putString("description",l.description);
            stream.putString("schema",l.schema);
            stream.putString("icon",l.icon);
            stream.putString("datatype",l.datatype);

            settings.putMap(l.name,stream);
        }
        promise.resolve(settings);
    }
}
