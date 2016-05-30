package com.connectordb_android;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class LoggerModule extends ReactContextBaseJavaModule {
    public LoggerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    }

    @Override
    public String getName() {
        return "Logger";
    }

    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }
}
