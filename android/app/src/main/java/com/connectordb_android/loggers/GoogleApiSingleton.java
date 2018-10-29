package com.connectordb_android.loggers;

import android.app.Activity;
import android.content.Context;
import android.content.IntentSender;
import android.os.Bundle;
import android.util.Log;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.fitness.Fitness;
import com.google.android.gms.location.LocationServices;

import java.util.LinkedList;
import java.util.ListIterator;

import android.content.Intent;

/**
 * GoogleApiSingleton handles all connecting and handling of the google api. You do not directly
 * create it, but rather use GoogleApiSingleton.get() to get a singleton instance for the entire application.
 * This instance holds the one google api connection that the entire app uses.
 */
public class GoogleApiSingleton implements
        GoogleApiClient.OnConnectionFailedListener,GoogleApiClient.ConnectionCallbacks {
    private static final String TAG = "GoogleApiSingleton";
    public static final int REQUEST_RESOLVE_ERROR = 1001;
    public interface ApiCallback {
        /**
         * connected is called when the google api client is valid. the associated client
         * is connected until disconnected is called
         * @param g
         */
        void connected(GoogleApiClient g);

        /**
         *  disconnected is called whenever an api disconnect is handled. Once disconnected
         *  is called, previously received api clients are no longer valid. disconnected can
         *  be called multiple times without intermediate connected calls.
         * @param reason a string reason for disconnection
         */
        void disconnected(String reason);
    }


    private static GoogleApiSingleton apiSingleton;

    /**
     * The main function using which the singleton is obtained.
     * @return Returns the singleton value
     */
    public static synchronized GoogleApiSingleton get() {
        if (apiSingleton==null) {
            apiSingleton = new GoogleApiSingleton();
        }
        return apiSingleton;
    }


    // From here on out, we have the methods used for managing the google api.


    private  LinkedList<ApiCallback> callbacks = new LinkedList<ApiCallback>();;
    // The api client
    private GoogleApiClient apiClient = null;
    // whether the api is currently resolving (and we queue up requests)
    private boolean apiResolving = false;
    private boolean resolvingError = false;


    private Activity activity;

    /**
     * start a google api connection. Gets all of the permissions necessary for the entire app.
     * @param c context from which to generate the client. The context must be active for the application
     *          lifetime. We are assuming that MainActivity is active always when app is being displayed,
     *          and we also assume that loggers are active for the lifetime of the application
     */
    private synchronized void startApiConnection(Context c) {
        apiResolving = true;


        apiClient = new GoogleApiClient.Builder(c)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                // Add the google APIs you want to use HERE, and a comment specifying which logger uses them
                .addApi(LocationServices.API)                       // LocationLogger
                .addApi(Fitness.RECORDING_API)
                .addApi(Fitness.HISTORY_API)
                .addScope(Fitness.SCOPE_ACTIVITY_READ)
                .addScope(Fitness.SCOPE_BODY_READ)
                .addScope(Fitness.SCOPE_LOCATION_READ).build();


        apiClient.connect();
        Log.i(TAG, "Connecting to Google APIs...");
    }

    @Override
    public void onConnectionFailed(ConnectionResult result) {
        if (resolvingError) {
            // Already attempting to resolve an error.
            return;
        } else if (result.hasResolution() && activity!=null) {
            try {
                resolvingError = true;
                result.startResolutionForResult(activity, REQUEST_RESOLVE_ERROR);
            } catch (IntentSender.SendIntentException e) {
                // There was an error with the resolution intent. Try again.
                apiClient.connect();
            }
        } else {


            String reason =result.toString();
            Log.e(TAG, "Google play services connection failed. Cause: " + reason);
            apiClient = null;
            apiResolving = false;

            ListIterator<ApiCallback> iter = callbacks.listIterator();
            while (iter.hasNext()) {
                iter.next().disconnected(reason);
            }
            resolvingError = false;
        }





    }
    @Override
    public void onConnected(Bundle connectionHint) {
        Log.i(TAG,"Google play services connected.");
        apiResolving = false;
        ListIterator<ApiCallback> iter = callbacks.listIterator();
        while (iter.hasNext()) {
            iter.next().connected(apiClient);
        }
    }

    @Override
    public void onConnectionSuspended(int cause) {
        Log.w("ConnectorDB", "Google play services connection suspended");
    }



    /**
     * Gets the singleton connection to the google api for the application.
     *
     * @param c An App context. This is only for use in loggers, as it fails
     *          to resolve errors correctly, since background services do not manage
     *          the connection correctly. If you have access to a FragmentActivity, use
     *          the setupGoogleApi which works similarly.
     * @param callback a callback. This will ONLY be called if the google api client connects
     *                 without issues. Callbacks are queued up while resolving/failed, and get called
     *                 when a connection succeeds. If a logger needs access to the google api,
     *                 it should not init anything until its api client is set up, and it should
     *                 stop gathering on disconnected
     */
    public synchronized void getGoogleApi(Context c,ApiCallback callback) {

        callbacks.add(callback);

        if (!apiResolving && apiClient!=null) {
            callback.connected(apiClient);
        } else if (!apiResolving){
            startApiConnection(c);
        }
    }

    /**
     * Works in the same way as getGoogleApi, with the fundamental difference that it enables
     * an auto-managed connection, meaning that the user will be prompted to sign in/whatever
     * google thinks they need to do their stuff. The reason this is separate from getGoogleApi
     * is because logging is done in the background, with no access to a FragmentActivity.
     * We therefore attempt to create the api with setupGoogleApi from the GUI, and set it up
     * with a context if running in background.
     *
     * When using this, the activity must have an onActivityResult as shown in
     * https://developers.google.com/android/guides/api-client#handle_connection_failures
     * except it should call googleApiResolve
     *
     * @param a an activity which will be called to handle resolving
     * @param callback same as getGoogleApi's callback
     */
    public void setupGoogleApi(Activity a,ApiCallback callback) {
        activity = a;
        getGoogleApi(a, callback);
    }

    /**
     * call this in onActivityResult of the Activity if it gets REQUEST_RESOLVE_ERROR
     * as a requestCode. It will handle post-resolution reconnection.
     * @param resultCode - the result code to use.
     */
    public void googleApiResolve(int resultCode) {
        resolvingError = false;
        if (resultCode == activity.RESULT_OK) {
            if (!apiClient.isConnecting() && !apiClient.isConnected()) {
                apiClient.connect();
            }
        } else {
            apiClient = null;
            apiResolving = false;

            ListIterator<ApiCallback> iter = callbacks.listIterator();
            while (iter.hasNext()) {
                iter.next().disconnected("API failed to resolve "+Integer.toString(resultCode));
            }
            resolvingError = true;
        }
    }

}