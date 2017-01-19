package com.connectordb_android;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.util.Log;

import com.connectordb_android.logger.GoogleApiSingleton;
import com.connectordb_android.logger.LoggerService;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.fitness.Fitness;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

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
                        .setMessage("Failed to connect to Google APIs - background data logging will not function.\n\nError: " + reason)
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




        /**
         * Returns the name of the main component registered from JavaScript.
         * This is used to schedule rendering of the component.
         */
    @Override
    protected String getMainComponentName() {
        return "connectordb_android";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
                new AppPackage()
        );
    }
}
