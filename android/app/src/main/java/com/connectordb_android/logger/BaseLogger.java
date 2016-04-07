package com.connectordb_android.logger;

import android.content.Context;
import android.util.Log;

/**
 * BaseLogger is the core class used for all logging streams. It handles the common operations,
 * such as writing datapoints to the cache and logging. In order to extend BaseLogger, you need
 * to have a close function, which will stop any gathering you are doing.
 */
public abstract class BaseLogger {

    private Context context;

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
     * @param c is the context. Because we need to pass around the context to do anything.
     */
    BaseLogger(String name, String streamname,String streamschema, Context c) {
        this.context = c;
        this.name = name;
        this.streamname = streamname;
        this.streamschema = streamschema;
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
        Log.d("LOGGING: "+this.streamname,datapoint);
        // TODO: uhhh... implement this?
    }

    // writes a log debug message
    protected void log(String s) {
        Log.d(this.name,s);
    }

    protected void warn(String s) {
        Log.w(this.name,s);
    }

    /**
     * setLogTimer sets up the time period between data updates. The value is in milliseconds.
     * There are two special values, which can be implemented in any way you want. If the logger
     * you're implementing does not have specific time period for logging, handle only -1 and 0
     * which represent off and on respectively.
     *
     * @param value The time in milliseconds between data updates. -1 means turn off logging
     *              and 0 means "background" - which the individual loggers are free to implement
     *              however they want.
     */
    public abstract void setLogTimer(int value);

    // Shuts down all logging. You must implement this.
    public abstract void close();

}