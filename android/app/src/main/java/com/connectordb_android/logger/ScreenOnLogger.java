package com.connectordb_android.logger;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

public class ScreenOnLogger extends BaseLogger {

    BroadcastReceiver phoneReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            long timestamp = System.currentTimeMillis();
            if(intent.getAction().equals(Intent.ACTION_SCREEN_ON)){
                ScreenOnLogger.this.insert(timestamp, "true");
            } else if(intent.getAction().equals(Intent.ACTION_SCREEN_OFF)){
                ScreenOnLogger.this.insert( timestamp, "false");
            }
        }
    };



    public ScreenOnLogger(Context c) {
        super("screenon","{\"type\":\"boolean\"}","Screen On","True when the device screen is on",
                "boolean","",c);
    }

    @Override
    public void enabled(boolean value) {
        if (!value) {
            log("Disabling");
            context.unregisterReceiver(phoneReceiver);
        } else {
            log("Enabling");
            IntentFilter monitorFilter = new IntentFilter();
            monitorFilter.addAction(Intent.ACTION_SCREEN_ON);
            monitorFilter.addAction(Intent.ACTION_SCREEN_OFF);
            context.registerReceiver(phoneReceiver, monitorFilter);
        }
    }


    public void close() {
        log("Shutting down");
        context.unregisterReceiver(phoneReceiver);
    }
}