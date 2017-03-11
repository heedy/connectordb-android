package com.connectordb_android;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;

import com.connectordb_android.loggers.LoggerService;
import com.connectordb_android.loggers.DatapointCache;

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
        } else if (intent.getAction().equals(WifiManager.NETWORK_STATE_CHANGED_ACTION)) {
            // The network state was changed. See if we are connected to some cool place
            // http://stackoverflow.com/questions/21391395/get-ssid-when-wifi-is-connected
            /*
            NetworkInfo netInfo = intent.getParcelableExtra (WifiManager.EXTRA_NETWORK_INFO);
            if (ConnectivityManager.TYPE_WIFI == netInfo.getType ()) {
                WifiManager wifiManager = (WifiManager) context.getSystemService (Context.WIFI_SERVICE);
                WifiInfo info = wifiManager.getConnectionInfo ();
                String ssid  = info.getSSID();
                DatapointCache.get(context).setSSID(ssid);
            }
            */

        } else {
            Log.w(TAG, "Unrecognized event: " + intent.getAction());
        }
    }
}