package com.connectordb_android.logger;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import java.util.LinkedList;
import java.util.ListIterator;

public class LoggerService extends Service {
    private static final String TAG = "LoggerService";

    private LinkedList<BaseLogger> loggers;

    public LoggerService() {

    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }


    @Override
    public void onCreate() {
        Log.d(TAG, "Initializing loggers...");
        loggers = new LinkedList<BaseLogger>();

        // Add all the relevant loggers here
        loggers.add(new LocationLogger(this));



        // Initialize the loggers with their specific logTimers
        ListIterator<BaseLogger> iter = loggers.listIterator();
        while (iter.hasNext()) {
            iter.next().setLogTimer(0);
        }
    }

    @Override
    public void onDestroy() {
        Log.d(TAG,"Shutting down logger service");

        // Run the close function for all loggers
        ListIterator<BaseLogger> iter = loggers.listIterator();
        while (iter.hasNext()) {
            iter.next().close();
        }

    }
}