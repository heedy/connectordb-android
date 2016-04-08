package com.connectordb_android.logger;

import android.content.Context;

import com.google.android.gms.fitness.data.DataPoint;
import com.google.android.gms.fitness.data.DataType;
import com.google.android.gms.fitness.data.Field;

import java.util.concurrent.TimeUnit;

public class HeartLogger extends GoogleFitLogger {

    HeartLogger(Context c) {
        super("HeartLogger","heartrate","{\"type\":\"number\"}",
                "number.heartrate.person","",c,DataType.TYPE_HEART_RATE_BPM);
    }

    @Override
    public void handleDatapoint(DataPoint dp) {
        //I didn't look too hard, since fuck spending more than 20 seconds to figure out how to read a damn datapoint,
        //so I did it the only way I could figure out: brute force. TL;DR: There is probably a better way of reading datapoints...
        String data = "";
        for (Field field : dp.getDataType().getFields()) {
            if (field.getName().equals("heart_rate")) {
                data += dp.getValue(field);
            }
        }
        long et = dp.getEndTime(TimeUnit.MILLISECONDS);


        insert(et, data);
    }



}