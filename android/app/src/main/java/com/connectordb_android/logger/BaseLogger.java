package com.connectordb_android.logger;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import java.util.ArrayList;

/**
 * BaseLogger is the core class used for all logging streams. It handles the common operations,
 * such as writing datapoints to the cache and logging. In order to extend BaseLogger, you need
 * to have a close function, which will stop any gathering you are doing.
 */
public abstract class BaseLogger {

    // A singleton array allowing iteration through all of the loggers.
    public static ArrayList<BaseLogger> loggerlist = new ArrayList<BaseLogger>();

    protected Context context;

    // These are only public for reading. Don't write them. I trust you, because I'm too lazy
    // to write getX()
    public String name;
    public String streamname;
    public String streamschema;

    /**
     * Sets up the BaseLogger - once this is set up, it is all you need to manage logging to ConnectorDB.
     * to see examples, look at one of the built-in loggers.
     *
     * @param name is a name to use when logging to the debug log
     * @param streamname is the name to use for the stream
     * @param streamschema is a stringified version of the JSONSchema to use for the stream
     * @param datatype the ConnectorDB datatype for the stream
     * @param icon the URLencoded icon to set up for the stream
     * @param c is the context. Because we need to pass around the context to do anything.
     */
    BaseLogger(String name, String streamname,String streamschema,String datatype, String icon, Context c) {
        this.context = c;
        this.name = name;
        this.streamname = streamname;
        this.streamschema = streamschema;

        // Register the stream if it DNE
        DatapointCache.get(c).ensureStream(streamname,streamschema,datatype,icon);

        // Add the stream to our logger list.
        // Not threadsafe, but whatever
        loggerlist.add(this);

        log("Starting");
    }

    /**
     * Returns the current timestamp. Can be directly used as the timestamp for insert
     * @return The current unix time in milliseconds
     */
    protected long timestamp() {
        return System.currentTimeMillis();
    }

    /**
     * insert adds the given datapoint to the cache, ready to be synced with ConnectorDB.
     * @param timestamp the unix timestamp in milliseconds. You can use BaseLogger.timestamp
     *                  to get the current timestamp
     * @param datapoint string of the datapoint that conforms to the stream's json schema.
     *                  Note that at this point in time, the JSON schema is not checked - it is
     *                  assumed that the datapoint is correct.
     */
    protected void insert(long timestamp, String datapoint) {
        insert_db(timestamp,datapoint,null);
    }

    /**
     * insert_db inserts with an optional database argument
     *
     */
    protected void insert_db(long timestamp, String datapoint, SQLiteDatabase db) {
        DatapointCache.get(context).insert(streamname,timestamp,datapoint,db);
    }

    /**
     * getDB gets a SQLite database for use in transactions
     */
    protected SQLiteDatabase getDB() {
        return DatapointCache.get(context).getDatabase();
    }

    // writes a log debug message
    protected void log(String s) {
        Log.d(this.name,s);
    }
    protected void warn(String s) {
        Log.w(this.name,s);
    }
    protected void error(String s) {
        Log.e(this.name,s);
    }

    /**
     * Allows to get settings for the logger from the app's key-value store.
     * All keys are prepended with the stream name, so there shouldn't be issues with
     * interference.
     * @param key
     * @return the key's value, and "" if it doesn't exist
     */
    protected String kvGet(String key) {
        return DatapointCache.get(context).getKey(streamname + "_"+key);
    }

    /**
     * Set a key value pair for the logger, which will be saved in the app's sqlite db.
     * @param key
     * @param value
     */
    protected void kvSet(String key,String value) {
        DatapointCache.get(context).setKey(streamname + "_"+key,value,null);
    }

    /**
     * setLogTimer sets up the time period between data updates. The value is in milliseconds.
     * There are two special values, which can be implemented in any way you want. If the logger
     * you're implementing does not have specific time period for logging, handle only -1 and 0
     * which represent off and on respectively. This is automatically called when the logger is started up.
     *
     * @param value The time in milliseconds between data updates. -1 means turn off logging
     *              and 0 means "background" - which the individual loggers are free to implement
     *              however they want.
     */
    public abstract void setLogTimer(int value);


    /**
     * gets the json schema to use when generating the settings form for this logger
     * @return json schema string
     */
    public abstract String getSettingSchema();

    // Shuts down all logging. You must implement this.
    public abstract void close();

}