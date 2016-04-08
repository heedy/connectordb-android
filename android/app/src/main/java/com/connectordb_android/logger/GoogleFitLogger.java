package com.connectordb_android.logger;

import android.content.Context;
import android.os.AsyncTask;
import android.os.Handler;

import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.fitness.Fitness;
import com.google.android.gms.fitness.FitnessStatusCodes;
import com.google.android.gms.fitness.data.DataType;


/**
 * The GoogleFitLogger handles all aspects of connecting to google's fitness API and
 * managing all relevant datapoints. Any class that wants to gather from the fitness api
 * can extend this class to make logging not so much of a PITA.
 *
 * The main difference between logging data normally and through the google fitness API is
 * that the fitness API actually handles all aspects of logging data in the background for us.
 * This means that all data is cached by google (it also means that google is getting a free copy
 * of the data, but face it, google already owns you anyways).
 * All we need to do is read the gathered data once in a while, and put it into our cache, so that it will be synced
 * to ConnectorDB.
 */
public abstract class GoogleFitLogger extends BaseLogger implements GoogleApiSingleton.ApiCallback, ResultCallback<Status> {

    /**
     * The GoogleFitLogger uses one background process to handle ALL google fit subscriptions,
     * so it synchronizes all at the same time, rather than wasting battery synchronizing one
     * at a time at different times.
     */

    protected GoogleApiClient googleApiClient;
    protected DataType dataType;
    protected int logtime = 0;

    // This is used to trigger sync every time period
    private Handler handler = new Handler();
    private boolean syncIsRunning = false;

    /**
     * sync takes the data that the fit API gathered for us, and moves it into our data cache,
     * so that it will be inserted into ConnectorDB next time the cache is synced. This step happens in the background.
     */
    private synchronized boolean sync() {
        if (googleApiClient==null || !googleApiClient.isConnected()) {
            warn("Google API is not connected - can't sync");
            return false;
        }

        log("Syncing");

        // We need to set up the time ranges to query from google's history
        long endTime = timestamp();

        return true;
    }

    /**
     * Syncer is a Runnable that runs sync in the background, and sets up a repeated sync
     */
    private class Syncer implements Runnable {
        @Override
        public void run() {
            new AsyncTask<Void,Void,Void>() {
                @Override
                protected Void doInBackground(Void ...params) {
                    GoogleFitLogger.this.sync();
                    GoogleFitLogger.this.runSyncer();
                    return null;
                }
            }.execute();
        }
    }

    /**
     * runSyncer sets up the syncer to auto run
     */
    private synchronized void runSyncer() {
        if (logtime == 0) {
            // Once an hour if nothing given
            logtime = 1000*60*60;
        }
        if (logtime > 0) {
            syncIsRunning = true;
            log("Setting up new sync in "+ Integer.toString(logtime));
            handler.postDelayed(new Syncer(),logtime);
        } else {
            syncIsRunning = false;
        }
    }

    private void ensureSyncer() {
        if (!syncIsRunning) {
            runSyncer();
        }
    }


    /**
     * GoogleFitLogger enables a logger which uses data fom Google Fit - it abstracts away all the annoyance
     * of handling the synchronization and syncing on your own, and directly gives you the correct stream to
     * process.
     *
     * @param dataType the fitness DataType to gather. Make sure that the correct scope for the datatypes
     *                 is enabled in GoogleApiSingleton, otherwise there will be a permissions error
     */
    GoogleFitLogger(String logName, String streamName, String jsonSchema, Context c,DataType dataType) {
        super(logName,streamName,jsonSchema,c);
        this.dataType = dataType;


        log("Connecting to Google Play services");
        GoogleApiSingleton.get().getGoogleApi(c, this);

    }

    // connected - enable logging
    @Override
    public void connected(GoogleApiClient g) {
        log("Google play services connected.");
        googleApiClient = g;
        gatherEnabled();
    }

    // disconnected callback from the GoogleApiSingleton
    @Override
    public void disconnected(String reason) {
        warn("Google play services connection failed");
        // well, crap

    }

    //Subscribing to data from fitness API
    @Override
    public void onResult(Status status) {
        if (status.isSuccess()) {
            if (status.getStatusCode()
                    == FitnessStatusCodes.SUCCESS_ALREADY_SUBSCRIBED) {
                log("Existing subscription for activity detected.");
            } else {
                log("Successfully subscribed!");
            }
        } else {
            if (status.getStatusMessage()!=null) {
                error( status.getStatusMessage());
            } else {
                error("subscribe to fit api failed");
            }
        }
    }


    private void gatherEnabled() {

        if (googleApiClient!=null && googleApiClient.isConnected()) {
            if (logtime!=-1) {
                log("Enabling");
                Fitness.RecordingApi.subscribe(googleApiClient, dataType)
                        .setResultCallback(this);
                ensureSyncer();


            } else {
                log("Disabling");
                Fitness.RecordingApi.unsubscribe(googleApiClient, dataType)
                        .setResultCallback(this);
            }
        }
    }

    /**
     * In the fitlogger, you can only turn logging on and off, since google's fitness API actually
     * gathers the data for us - all we control is when we sync to our cache.
     *
     * @param value The time in milliseconds between data updates. -1 means turn off logging
     *              and 0 means "background" - which the individual loggers are free to implement
     */
    @Override
    public void setLogTimer(int value) {
        logtime=value;
        // If not -1, enable gather
        gatherEnabled();
    }

    /**
     * Note: We are making the critical assumption that the lifetime of the FitLogger is the same as
     * the lifetime of the full application, since we are not removing this instance from loggers
     */
    @Override
    public void close() {
        log("Closing fit logger");
    }

}