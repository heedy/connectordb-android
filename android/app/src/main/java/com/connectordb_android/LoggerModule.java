package com.connectordb_android;

import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import com.connectordb_android.logger.BaseLogger;
import com.connectordb_android.logger.DatapointCache;
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
    private static String TAG = "LoggerModule";
    private Context context;
    public LoggerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
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

    /**
     * setEnabled allows to enable/disable loggers
     * @param key the name of the logger for which to set enabled value
     * @param value whether the logger is to be enabled or not
     */
    @ReactMethod
    public void setEnabled(String key, boolean value) {
        Iterator<BaseLogger> iter = LoggingManager.get().loggers.iterator();
        while (iter.hasNext()) {
            BaseLogger l = iter.next();
            if (l.name.equals(key)) {
                Log.d(TAG, "setEnabled: "+key);
                l.enabled(value);
                break;
            }
        }
    }

    /**
     * The time in seconds between auto-syncs. -1 means to disable sync
     * @param time
     */
    @ReactMethod
    public void setSyncTime(int time) {
        if (time <0) {
            DatapointCache.get(context).disableTimedSync();
        } else {
            DatapointCache.get(context).enableTimedSync(time);
        }

    }

    /**
     * Sets the credentials to use for synchronization
     * @param server
     * @param devicename
     * @param apikey
     */
    @ReactMethod
    public void setCred(String server,String devicename,String apikey) {
        DatapointCache.get(context).setCred(server,devicename,apikey);
    }

    /**
     * allows to synchronize on command
     */
    @ReactMethod
    public void sync() {
        DatapointCache.get(context).sync();
    }

    /**
     * Gets the current number of datapoints cached - allows to display current cache size
     */
    @ReactMethod
    public void length(Promise promise) {
        promise.resolve(DatapointCache.get(context).size());
    }

    /**
     * Clears all cached datapoints
     */
    @ReactMethod
    public void clear() {
        DatapointCache.get(context).clearCache();
    }
}
