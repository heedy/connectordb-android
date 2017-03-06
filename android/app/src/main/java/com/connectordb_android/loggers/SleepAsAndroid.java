package com.connectordb_android.loggers;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.net.Uri;
import android.renderscript.Double2;
import android.util.Log;

public class SleepAsAndroid extends ContentProviderLogger {

    SleepAsAndroid(Context c) {
        super("sleep","{\"type\":\"boolean\"}",
                "Sleep","Sleep data gathered by Sleep As Android app","","material:hotel",false,c);

    }

    @Override
    public long getData(long t1, SQLiteDatabase db) {

        // http://sleep.urbandroid.org/documentation/developer-api/intents-and-content-providers/
        Uri location = Uri.parse("content://com.urbandroid.sleep.history/records");

        String[] projection = new String[] {"startTime","toTime","rating"};

        String selection = "toTime > " + Long.toString(t1);
        String sortOrder = "toTime ASC";
        try {
            Cursor c = context.getContentResolver().query(location,projection,selection,null,sortOrder);
            if (c.moveToFirst()) {
                do {
                    long start = c.getLong(c.getColumnIndex("startTime"));
                    long end = c.getLong(c.getColumnIndex("toTime"));
                    //log("Sleep time: "+ Long.toString(start) + " to " + Long.toString(end));
                    // We now have the sleep time.
                    // TODO: Add extra stream for sleep rating
                    t1 = end;

                    insert_db(start,"true",db);
                    insert_db(end,"false",db);
                } while (c.moveToNext());
            } else {
                log("No sleep data");
            }
        } catch (Exception ex) {
            error(ex.getMessage());
        }


        return t1;
    }
}
