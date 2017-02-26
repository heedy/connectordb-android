package com.connectordb_android.loggers;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import java.util.LinkedList;
import java.util.ListIterator;

public class LoggerService extends Service {
    private static final String TAG = "LoggerService";


    public LoggerService() {

    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }


    @Override
    public void onCreate() {
        Log.d(TAG, "Initializing loggers...");

        LoggingManager m = LoggingManager.get();

        /**
         * Initialize all loggers here. In the future, someone could figure out how to
         * set up the loggers to auto-register. But this will do for now.
         */

        m.add(new LocationLogger(this));
        m.add(new PluggedInLogger(this));
        m.add(new ScreenOnLogger(this));
        /*
        m.add(new StepLogger(this));
        m.add(new ActivityLogger(this));
        m.add(new HeartLogger(this));
        */


    }

    @Override
    public void onDestroy() {
        Log.d(TAG,"Shutting down logger service");

        LoggingManager.get().close();

    }
}