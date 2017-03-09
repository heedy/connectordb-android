package com.connectordb_android.loggers;


import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

public abstract class BaseLogger {
    protected Context context;

    // These are only public for reading. Don't write them after initialization. I trust you, because I'm too lazy
    // to write getX()
    public String name;
    public String nickname;
    public String description;
    public String datatype;
    public String schema;
    public String icon;
    public String category; // The category is for allowing different types of plugins

    /**
     * Sets up the BaseLogger - once this is set up, it is all you need to manage logging to ConnectorDB.
     * to see examples, look at one of the built-in loggers.
     *
     * @param name        is a name to use when logging to the debug log
     * @param schema      is a stringified version of the JSONSchema to use for the stream
     * @param nickname    - the nickname to give the stream
     * @param description - a string describing what the stream does
     * @param datatype    - optional conectordb datatype
     * @param icon        is the ison to use. Optional.
     * @param c           is the context. Because we need to pass around the context to do anything.
     */
    BaseLogger(String name, String schema, String nickname, String description, String datatype, String icon, String category, boolean defaultEnabled, Context c) {
        this.context = c;
        this.name = name;
        this.schema = schema;
        this.nickname = nickname;
        this.description = description;
        this.datatype = datatype;

        // Register the stream if it DNE
        DatapointCache.get(c).ensureStream(name, schema, nickname, description, datatype, icon);

        // If the stream is enabled by default, set the enabled state to true
        if (defaultEnabled) {
            if (kvGet("enabled").isEmpty()) {
                kvSet("enabled","true");
            }
        }
    }


    /**
     * init is called after the constructor, which finishes setup
     */
    public void init() {
        // Get the logger's status - and set it to enabled (false) if such a status does not exist
        if (kvGet("enabled").equals("true")) {
            enabled(true);
        } else {
            enabled(false);
        }
    }

    /**
     * Returns the current timestamp. Can be directly used as the timestamp for insert
     *
     * @return The current unix time in milliseconds
     */
    protected long timestamp() {
        return System.currentTimeMillis();
    }

    /**
     * insert adds the given datapoint to the cache, ready to be synced with ConnectorDB.
     *
     * @param timestamp the unix timestamp in milliseconds. You can use BaseLogger.timestamp
     *                  to get the current timestamp
     * @param datapoint string of the datapoint that conforms to the stream's json schema.
     *                  Note that at this point in time, the JSON schema is not checked - it is
     *                  assumed that the datapoint is correct.
     */
    protected void insert(long timestamp, String datapoint) {
        insert_db(timestamp, datapoint, null);
    }

    /**
     * insert_db inserts with an optional database argument
     */
    protected void insert_db(long timestamp, String datapoint, SQLiteDatabase db) {
        DatapointCache.get(context).insert(name, timestamp, datapoint, db);
    }

    /**
     * getDB gets a SQLite database for use in transactions
     */
    protected SQLiteDatabase getDB() {
        return DatapointCache.get(context).getDatabase();
    }

    // writes a log debug message
    protected void v(String s) {
        Log.v(this.name, s);
    }
    protected void log(String s) {
        Log.d(this.name, s);
    }
    protected void warn(String s) {
        Log.w(this.name, s);
    }
    protected void error(String s) {
        Log.e(this.name, s);
    }

    /**
     * Allows to get settings for the logger from the app's key-value store.
     * All keys are prepended with the stream name, so there shouldn't be issues with
     * interference.
     * @param key
     * @return the key's value, and "" if it doesn't exist
     */
    protected String kvGet(String key) {
        return DatapointCache.get(context).getKey(name + "_"+key,null);
    }

    /**
     * Set a key value pair for the logger, which will be saved in the app's sqlite db.
     * @param key
     * @param value
     */
    protected void kvSet(String key,String value) {
        DatapointCache.get(context).setKey(name + "_"+key,value,null);
    }

    /**
     * setEnabled is to be used to set the enabled state of the logger such that the state is
     * saved to the kv store
     * @param value
     */
    public void setEnabled(boolean value) {
        kvSet("enabled",value?"true":"false");
        // call enabled
        enabled(value);
    }

    /**
     * Returns whether this plugin is enabled or not
     * @return enabled?
     */
    public boolean isEnabled() {
        return kvGet("enabled").equals("true");
    }

    /**
     * enabled allows to turn on/off specific loggers
     *
     * @param value Whether this logger is enabled
     */
    protected abstract void enabled(boolean value);

    // Shuts down all logging. You must implement this.
    public abstract void close();

}
