package com.connectordb_android.logger;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;

public class PluggedInLogger extends BaseLogger {

    BroadcastReceiver phoneReceiver = new BroadcastReceiver() {
        Boolean hadBatteryMessage = false;
        Boolean currentStatus = false;
        @Override
        public void onReceive(Context context, Intent intent) {
            long timestamp = System.currentTimeMillis();
            if (intent.getAction().equals(Intent.ACTION_BATTERY_CHANGED)) {
                int plugged = intent.getIntExtra(BatteryManager.EXTRA_PLUGGED, -1);
                switch (plugged) {
                    case BatteryManager.BATTERY_PLUGGED_USB:
                    case BatteryManager.BATTERY_PLUGGED_AC:
                        if (hadBatteryMessage && !currentStatus || !hadBatteryMessage) {
                            PluggedInLogger.this.insert( timestamp, "true");
                            hadBatteryMessage = true;
                            currentStatus = true;
                        }
                        break;
                    case 0:
                        if (hadBatteryMessage && currentStatus || !hadBatteryMessage) {
                            PluggedInLogger.this.insert( timestamp, "false");

                            hadBatteryMessage = true;
                            currentStatus = false;
                        }
                        break;
                }
            }
        }
    };



    public PluggedInLogger(Context c) {
        super("pluggedin","{\"type\":\"boolean\"}","Plugged In", "True when the device is currently plugged in",
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
            monitorFilter.addAction(Intent.ACTION_BATTERY_CHANGED);
            context.registerReceiver(phoneReceiver, monitorFilter);
        }
    }


    public void close() {
        log("Shutting down");
        context.unregisterReceiver(phoneReceiver);
    }
}