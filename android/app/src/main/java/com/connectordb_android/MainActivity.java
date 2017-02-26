package com.connectordb_android;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;

import com.connectordb_android.loggers.GoogleApiSingleton;
import com.connectordb_android.loggers.LoggerService;
import com.facebook.react.ReactActivity;
import com.google.android.gms.common.api.GoogleApiClient;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "connectordb_android";
    }

    /**
     * Sets up all of the things that need to be set up for the app to work correctly.
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // we call setupGoogleApi so that it uses our activity to show dialogs
        GoogleApiSingleton.get().setupGoogleApi(this, new GoogleApiSingleton.ApiCallback() {
            @Override
            public void connected(GoogleApiClient g) {
                // Do nothing
            }

            @Override
            public void disconnected(String reason) {
                new AlertDialog.Builder(MainActivity.this)
                        .setMessage("Failed to connect to Google APIs - data streams dependent on Google APIs will not gather data.\n\nError: " + reason)
                        .setTitle("Logging Failure")
                        .setPositiveButton("OK",
                                new DialogInterface.OnClickListener() {
                                    public void onClick(DialogInterface dialog, int which) {
                                        //dismiss the dialog
                                    }
                                }).show();
            }
        });

        // Start the background gathering logger service
        startService(new Intent(this, LoggerService.class));
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == GoogleApiSingleton.REQUEST_RESOLVE_ERROR) {
            GoogleApiSingleton.get().googleApiResolve(resultCode);
        }
    }
}
