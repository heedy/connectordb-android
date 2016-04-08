package com.connectordb_android.logger;

import android.content.Context;

import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.fitness.Fitness;
import com.google.android.gms.fitness.FitnessStatusCodes;
import com.google.android.gms.fitness.data.DataType;
import com.google.android.gms.location.LocationServices;

public class StepLogger extends GoogleFitLogger {
    private int logtime;
    private GoogleApiClient googleApiClient;

    StepLogger(Context c) {
        super("StepLogger","steps","{\"type\":\"number\"}",c,DataType.TYPE_STEP_COUNT_DELTA);
    }





}