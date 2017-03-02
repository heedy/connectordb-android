package com.connectordb_android.loggers;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;

import com.google.android.gms.fitness.data.DataPoint;
import com.google.android.gms.fitness.data.DataType;
import com.google.android.gms.fitness.data.Field;

import java.util.concurrent.TimeUnit;

public class ActivityLogger extends GoogleFitLogger {

    ActivityLogger(Context c) {
        super("activity","{\"type\":\"string\"}","Activity Type","The current activity that phone is detecting",
                "string.person.activity","material:motorcycle",true,c,DataType.TYPE_ACTIVITY_SAMPLE);
    }

    @Override
    public void handleDatapoint(SQLiteDatabase db, DataPoint dp) {
        double confidence = 0.;
        String data = "";
        for(Field field : dp.getDataType().getFields()) {
            if (field.getName().equals("activity")) {
                data += dp.getValue(field).asActivity();
            } else {
                confidence = dp.getValue(field).asFloat();
            }
        }
        // Only insert the datapoint is > 50% confidence in activity
        if (confidence > 0.5) {
            long et = dp.getEndTime(TimeUnit.MILLISECONDS);

            insert_db(et, "\"" + data + "\"",db);
        }
    }



}