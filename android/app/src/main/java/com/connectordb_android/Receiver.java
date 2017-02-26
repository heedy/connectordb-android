package com.connectordb_android;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.connectordb_android.loggers.LoggerService;

/**
 * Receiver handles broadcasts to the app - it starts logging on boot, and will
 * hopefully do more in the future.
 */
public class Receiver extends BroadcastReceiver {
    private static final String TAG = "BroadcastReceiver";
    public Receiver() {
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals("android.intent.action.BOOT_COMPLETED")) {
            Log.v(TAG, "RECEIVED BOOT");

            //Start the logger service on boot!
            context.startService(new Intent(context, LoggerService.class));

        } else if (intent.getAction().equals("android.net.conn.CONNECTIVITY_CHANGE")) {
            Log.v(TAG, "CONNECTIVITY CHANGE");

            // TODO: At some point, it would be useful to implement "sync on wifi" or
            // something of the sort
            //context.startService(new Intent(context, SyncService.class));
        } else {
            Log.w(TAG, "Unrecognized event: " + intent.getAction());
        }
    }
}