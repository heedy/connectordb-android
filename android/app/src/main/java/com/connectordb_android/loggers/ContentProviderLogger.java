package com.connectordb_android.loggers;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;

public abstract class ContentProviderLogger extends BaseLogger implements DatapointCache.PreSyncer {
    public static final String TAG = "Content Provider Logging";

    /**
     * In this function, you get data from the content provider. You should get the data between
     * t1 and t2, and insert the datapoints into the database db
     * @param startTime - start time (unix timestamp milliseconds) to query data from
     * @param db the database to use. A transaction to the database was already started for you.
     *
     * @return The last timestamp inserted. The return + 1 will be the t1 for the next call to getData.
     */
    public abstract long getData(long startTime, SQLiteDatabase db);

    ContentProviderLogger(String streamName, String jsonSchema, String nickname, String description,
                          String datatype,String icon, Boolean defaultEnabled, Context c) {
        super(streamName,jsonSchema,nickname,description,datatype,icon,"Apps", defaultEnabled,c);

        // Add ourselves to the pre-sync calls, so that preSync is called before a sync.
        DatapointCache.get(context).addPreSync(this);
    }

    @Override
    public void preSync() {
        // This function is called right before a sync. Let's get t1, and start a database
        // transaction so that getData can jump right in.
        // We keep track of the start time so we don't query for unnecessary datapoints in the future.
        if (isEnabled()) {
            long startTime = 1;
            try {
                startTime = Long.parseLong(kvGet("cpl_startTime"));
            } catch(NumberFormatException nfe) {}

            SQLiteDatabase db = getDB();
            db.beginTransactionNonExclusive();

            startTime = getData(startTime,db);

            db.setTransactionSuccessful();
            db.endTransaction();

            kvSet("cpl_startTime", Long.toString(startTime));
        }

    }

    @Override
    protected void enabled(boolean value) {
       // The enabled value was already set in BaseLogger. No need to do anything.
    }

    @Override
    public void close() {
        // Nothing to be done here
    }
}