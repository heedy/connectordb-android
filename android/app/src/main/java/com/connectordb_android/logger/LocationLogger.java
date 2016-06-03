package com.connectordb_android.logger;

import android.content.Context;
import android.location.Location;

import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;

public class LocationLogger extends BaseLogger implements LocationListener, GoogleApiSingleton.ApiCallback {
    private LocationRequest locationRequest;
    private GoogleApiClient googleApiClient;

    public LocationLogger(Context c) {
        super("location",
                "{\"type\":\"object\",\"properties\":" +
                        "{\"latitude\":{\"type\":\"number\"}," +
                        "\"longitude\": {\"type\": \"number\"}," +
                        "\"altitude\": {\"type\": \"number\"}," +
                        "\"accuracy\": {\"type\": \"number\"}," +
                        "\"speed\": {\"type\": \"number\"}," +
                        "\"bearing\": {\"type\": \"number\"}" +
                        "},\"required\": [\"latitude\",\"longitude\"]}",
                "","GPS coordinates",
                "location.gps","",c);

        // Logging GPS requires connecting the google play services
        log("Connecting to Google Play services");

        GoogleApiSingleton.get().getGoogleApi(c, this);
    }

    @Override
    public void connected(GoogleApiClient g) {
        log("Google play services connected.");
        googleApiClient = g;
        if (locationRequest!=null) {
            LocationServices.FusedLocationApi.requestLocationUpdates(googleApiClient, locationRequest, this);
        }
    }

    @Override
    public void disconnected(String reason) {
        warn("Google play services connection failed");
    }

    @Override
    public void onLocationChanged(Location location) {
        // Called when the location changes. This function sets up the datapoint's
        // JSON structure ready for insert
        String data = "{\"latitude\": "+Double.toString(location.getLatitude())+
                ", \"longitude\": "+Double.toString(location.getLongitude());
        if (location.hasAltitude()) {
            data += ", \"altitude\": " + Double.toString(location.getAltitude());
        }
        if (location.hasAccuracy()) {
            data+= ", \"accuracy\": "+Double.toString(location.getAccuracy());
        }
        if (location.hasSpeed()) {
            data+= ", \"speed\": " + Double.toString(location.getSpeed());
        }
        if (location.hasBearing()) {
            data+= ", \"bearing\": " + Double.toString(location.getBearing());
        }

        insert(location.getTime(), data + "}");

    }

    // setLogTimer sets the time in milliseconds between requested locatino updates. -1 stops updates,
    // 0 sets updating in the background, and a positive value sets the update interval to the given number
    // of milliseconds
    public void setLogTimer(int value) {
        if (value==0) {
            log("Setting Battery Saver mode");
            locationRequest = new LocationRequest();
            locationRequest.setFastestInterval(1000);
            locationRequest.setPriority(LocationRequest.PRIORITY_NO_POWER);
        } else if (value>0){
            log("Setting location ms: " + Integer.toString(value));
            locationRequest = new LocationRequest();
            locationRequest.setInterval(value);
            locationRequest.setFastestInterval(1000);
            locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        }

        if (googleApiClient!=null && googleApiClient.isConnected()) {
            LocationServices.FusedLocationApi.removeLocationUpdates(googleApiClient,this);
            if (value>=0) {
                LocationServices.FusedLocationApi.requestLocationUpdates(googleApiClient, locationRequest, this);
            }
        }
    }

    @Override
    public void enabled(boolean value) {
        setLogTimer(value?0:-1);
    }

    @Override
    public void close() {
        log("Closing");
        if (googleApiClient!=null && googleApiClient.isConnected()) {
            LocationServices.FusedLocationApi.removeLocationUpdates(googleApiClient,this);
        }

    }

}