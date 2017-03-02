package com.connectordb_android.loggers;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;

import com.google.android.gms.fitness.data.DataPoint;
import com.google.android.gms.fitness.data.DataType;
import com.google.android.gms.fitness.data.Field;

import java.util.concurrent.TimeUnit;

public class StepLogger extends GoogleFitLogger {
    StepLogger(Context c) {
        super("steps","{\"type\":\"number\"}","Step Count","Number of steps taken",
                "number.stepcount","material:directions_walk",true,c,DataType.TYPE_STEP_COUNT_DELTA);
    }

    @Override
    public void handleDatapoint(SQLiteDatabase db, DataPoint dp) {
        //I didn't look too hard, since fuck spending more than 20 seconds to figure out how to read a damn datapoint,
        //so I did it the only way I could figure out: brute force. TL;DR: There is probably a better way of reading datapoints...
        String data = "";
        for (Field field : dp.getDataType().getFields()) {
            if (field.getName().equals("steps")) {
                data += dp.getValue(field);
            }
        }
        long et = dp.getEndTime(TimeUnit.MILLISECONDS);


        insert_db(et, data,db);
    }



}