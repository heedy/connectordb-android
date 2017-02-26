package com.connectordb_android.loggers;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

public class ScreenOnLogger extends BaseLogger {
    private boolean enabled = false;

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
        super("screenon","{\"type\":\"boolean\"}","Screen On","Logs when the device screen is turned on and off",
                "boolean","material:smartphone",
                "Defaults",true,c);
    }

    @Override
    protected void enabled(boolean value) {
        if (!value) {
            if (enabled) {
                log("Disabling");
                context.unregisterReceiver(phoneReceiver);
                enabled = false;
            }else {
                log("Disabled.");
            }

        } else {
            log("Enabling");
            IntentFilter monitorFilter = new IntentFilter();
            monitorFilter.addAction(Intent.ACTION_SCREEN_ON);
            monitorFilter.addAction(Intent.ACTION_SCREEN_OFF);
            context.registerReceiver(phoneReceiver, monitorFilter);
            enabled = true;
        }
    }


    public void close() {
        log("Shutting down");
        context.unregisterReceiver(phoneReceiver);
    }
}