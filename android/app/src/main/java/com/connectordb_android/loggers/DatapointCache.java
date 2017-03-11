package com.connectordb_android.loggers;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.DatabaseUtils;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.net.wifi.SupplicantState;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.AsyncTask;
import android.os.Handler;
import android.util.Log;

import java.util.ArrayList;
import java.util.Iterator;

import com.connectordb.client.ConnectorDB;
import com.connectordb.client.RequestFailedException;
import com.connectordb.client.Stream;

/**
 * DatapointCache holds an SQLite database which manages all of the information needed to
 * perform data gathering and syncing to ConnectorDB in the background.
 *
 * The cache is used as a singleton using DatapointCache.get()
 *
 * The cache manages datapoints, streams, and is a key-value store for properties.
 *
 * The DatapointCache also manages synchronization with ConnectorDB
 */
public class DatapointCache extends SQLiteOpenHelper {
    public static final int DATABASE_VERSION = 4;
    public static final String TAG = "DatapointCache";
    public static final String DATABASE_NAME = "DatapointCache.db";
    public Context context;

    //The class is used as a singleton in the application
    private static DatapointCache datapointCache;

    public static synchronized DatapointCache get(Context c) {
        if (datapointCache == null) {
            if (c == null) {
                Log.e(TAG, "Context not supplied to DatapointCache!");
            }
            Log.v(TAG, "Initializing Datapoint Cache");
            datapointCache = new DatapointCache(c);
        }
        return datapointCache;
    }

    /**
     * Sets up the DatapointCache, and starts the syncer
     * @param context a context to use for the database. Remember
     *                that the context needs to be long-lived.
     */
    public DatapointCache(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
        this.context = context;

        long syncenabled = 0;
        try {
            syncenabled = Long.parseLong(this.getKey("syncenabled",null));
        } catch (NumberFormatException nfe) {
        }

        if (syncenabled > 0) {
            Log.i(TAG, "Sync is Enabled");
            this.startSyncWait();
        } else {
            Log.i(TAG, "Sync is disabled");
        }

    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        Log.v(TAG, "Creating new logger cache database");
        db.execSQL(
                "CREATE TABLE streams (streamname TEXT PRIMARY KEY, schema TEXT, nickname TEXT, description TEXT, datatype TEXT, icon TEXT);");
        db.execSQL("CREATE TABLE cache (streamname TEXT, timestamp REAL, data TEXT);");
        db.execSQL("CREATE TABLE kv (key TEXT PRIMARY KEY, value TEXT);");

        //Now fill in the default values in kv for syncing
        db.execSQL("INSERT INTO kv VALUES ('server','https://connectordb.com');");
        db.execSQL("INSERT INTO kv VALUES ('devicename','');");
        db.execSQL("INSERT INTO kv VALUES ('__apikey','');");

        // The default synchronization period is 20 minutes, but sync is disabled
        db.execSQL("INSERT INTO kv VALUES ('syncperiod','1200000');");
        db.execSQL("INSERT INTO kv VALUES ('syncenabled','0');"); // Sync is disabled by default
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        Log.w(TAG, "Upgrading Cache...");
        // Get the old values that should be moved over
        String syncenabled = this.getKey("syncenabled", db);
        String server = this.getKey("server", db);
        String devicename = this.getKey("devicename", db);
        String apikey = this.getKey("__apikey", db);
        String syncperiod = this.getKey("syncperiod",db);

        // Drop the tables and rebuild them
        db.execSQL("DROP TABLE IF EXISTS cache;");
        db.execSQL("DROP TABLE IF EXISTS streams;");
        db.execSQL("DROP TABLE IF EXISTS kv;");
        onCreate(db);

        // Set the values that we're moving over
        setKey("server", server, db);
        setKey("devicename", devicename, db);
        setKey("apikey", apikey, db);
        setKey("syncenabled", syncenabled, db);
        setKey("syncperiod",syncperiod,db);

        // Note: this loses the streams that are to be logged!
    }

    /**
     * getKey returns the value for the given key from the KV store.
     * @param key
     * @param db optional database to use (for setting in transactions)
     * @return the value - empty string if DNE
     */
    public String getKey(String key, SQLiteDatabase db) {
        if (db == null)
            db = this.getReadableDatabase();
        Cursor res = db.rawQuery("SELECT value FROM kv WHERE key=?;", new String[] { key });
        if (res.getCount() == 0) {
            return "";
        } else {
            res.moveToNext();
            if (key.startsWith("__")) {
                Log.v(TAG, "Got: *****");
            } else {
                Log.v(TAG, "Got: " + key + " " + res.getString(0));
            }
            return res.getString(0);
        }
    }

    /**
     * Sets the given KV pair in the KV store
     * @param key
     * @param value
     * @param db optional database to use (for setting in transactions)
     */
    public void setKey(String key, String value, SQLiteDatabase db) {
        if (db == null)
            db = this.getWritableDatabase();
        if (key.startsWith("__")) {
            Log.v(TAG, "SET " + key + " TO ********");
        } else {
            Log.v(TAG, "SET " + key + " TO " + value);
        }
        ContentValues contentValues = new ContentValues();
        contentValues.put("key", key);
        contentValues.put("value", value);
        db.replace("kv", null, contentValues);
    }

    public void setCred(String server, String device, String apikey) {
        this.setKey("devicename", device, null);
        this.setKey("__apikey", apikey, null);
        this.setKey("server", server, null);
    }

    /**
     * The ssid of the currently connected network.
     */
    public String getSSID() {
        WifiManager wifiManager = (WifiManager) context.getSystemService (Context.WIFI_SERVICE);
        WifiInfo info = wifiManager.getConnectionInfo ();
        if (info.getSupplicantState() == SupplicantState.COMPLETED) {
            String ssid = info.getSSID();
            // https://code.google.com/p/android/issues/detail?id=43336
            if (ssid.equals("0x") || ssid.equals("<unknown ssid>")) {
                return "";
            }
            return ssid;
        }
        return "";
    }

    /**
     * Here, you can set/get the SSID which is required
     * for a sync to happen. If connected to a different network,
     * the app will not sync. If the ssid is an empty string,
     * the app will always sync
     * @param ssid
     */
    public void setSyncSSID(String ssid) {
        this.setKey("ssid_sync",ssid,null);
    }
    public String getSyncSSID() {
        return this.getKey("ssid_sync",null);
    }

    /**
     * ensureStream adds the stream to the DatapointCache. This will make the stream be created
     * if it doesn't exist, and synced to ConnectorDB
     *
     * @param stream the stream name
     * @param schema the jsonSchema
     * @param nickname the stream's nickname
     * @param description the stream's description
     * @param datatype connectorDB datatype for the stream
     * @param icon urlencoded icon to use for the stream
     */
    public void ensureStream(String stream, String schema, String nickname, String description, String datatype,
            String icon) {
        Log.v(TAG, "Ensuring stream " + stream);

        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
        contentValues.put("streamname", stream);
        contentValues.put("schema", schema);
        contentValues.put("description", description);
        contentValues.put("nickname", nickname);
        contentValues.put("datatype", datatype);
        contentValues.put("icon", icon);
        db.insertWithOnConflict("streams", null, contentValues, SQLiteDatabase.CONFLICT_IGNORE);
    }

    /**
     * For use in transactions - do NOT keep this longer than necessary.
     * @return a writable sqlite database
     */
    public SQLiteDatabase getDatabase() {
        return this.getWritableDatabase();
    }

    /**
     * insert the given datapoint into the cache. When inserting datapoints, make sure to run
     * ensureStream first, to register the stream from which the datapoints come. Otherwise DatapointCache
     * won't recognize the points.
     * @param stream
     * @param timestamp
     * @param data
     * @param db An optional database (set to null) to use (for transactions)
     * @return whether insert was successful
     */
    public synchronized boolean insert(String stream, long timestamp, String data, SQLiteDatabase db) {
        if (db == null)
            db = this.getWritableDatabase();
        Log.v(TAG, "[s=" + stream + " t=" + Long.toString(timestamp) + " d=" + data + "]");

        ContentValues contentValues = new ContentValues();
        contentValues.put("streamname", stream);
        contentValues.put("timestamp", ((double) timestamp) / 1000.0);
        contentValues.put("data", data);
        db.insert("cache", null, contentValues);
        return true;
    }

    //Returns the number of cached datapoints
    public int size() {
        SQLiteDatabase db = this.getReadableDatabase();
        int numRows = (int) DatabaseUtils.queryNumEntries(db, "cache");
        Log.v(TAG, "Cache Size: " + Integer.toString(numRows));
        return numRows;
    }

    // Deletes all cached datapoints
    public void clearCache() {
        SQLiteDatabase db = this.getWritableDatabase();
        db.execSQL("DELETE FROM cache;");
    }

    /**
     * All functions from now on handle synchronization with ConnectorBD
     */

    final Handler handler = new Handler();
    Runnable syncer = new Runnable() {
        public void run() {
            new AsyncTask<Void, Void, Void>() {
                @Override
                protected Void doInBackground(Void... params) {
                    String syncSSID = getSyncSSID();
                    String curSSID = getSSID();
                    if (!syncSSID.equals(curSSID) && !syncSSID.isEmpty()) {
                        Log.i(TAG,"Not syncing. Connected to " + curSSID + " but " + syncSSID + " is required.");
                    } else {
                        DatapointCache.this.sync();
                    }
                    DatapointCache.this.startSyncWait();
                    return null;
                }
            }.execute();
        }
    };

    public void startSyncWait() {

        long waittime = Long.parseLong(this.getKey("syncperiod",null));

        if (waittime > 0) {
            Log.v(TAG, "Setting next sync in " + waittime);
            handler.postDelayed(syncer, waittime);
        }
    }

    public void disableTimedSync() {
        Log.v(TAG, "Disabling syncer");
        handler.removeCallbacks(syncer);
        this.setKey("syncenabled", "0", null);

    }

    /**
     *
     * @param time time in seconds between sync attempts
     */
    public synchronized void enableTimedSync(long time) {
        disableTimedSync();
        this.setKey("syncenabled", "1", null);
        this.setKey("syncperiod", Long.toString(time * 1000), null);
        startSyncWait();
    }

    /**
     *
     * @return Whether or not background synchronization is currently enabled
     */
    public synchronized boolean getSyncEnabled() {
        return this.getKey("syncenabled",null).equals("1");
    }

    /**
     *
     * @return The time is seconds between sync attempts if sync is enabled
     */
    public long getSyncTime() {
        return Long.parseLong(this.getKey("syncperiod",null));
    }

    public void bgSync() {
        new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... params) {
                DatapointCache.this.sync();
                return null;
            }
        }.execute();
    }

    /*
    Certain loggers might want to perform a task before sync.
    For example, in certain cases, data is logged in the background,
    by android itself to conserve battery. Or the plugin gathers data
    from another android app, which stores it. In this case, these plugins
    will be called to perform their task before a sync is completed.
     */
    public interface PreSyncer {
        public void preSync();
    }

    private static ArrayList<PreSyncer> presync = new ArrayList<PreSyncer>();

    public synchronized void addPreSync(PreSyncer p) {
        Log.v(TAG, "Added Presyncer");
        presync.add(p);
    }

    //Synchronizes the database with the server
    public synchronized boolean sync() {
        Log.i(TAG, "Starting sync");

        Log.v(TAG, "Running Presync tasks");
        Iterator<PreSyncer> iter = presync.iterator();
        while (iter.hasNext()) {
            iter.next().preSync();
        }

        String server = this.getKey("server",null);
        String devicename = this.getKey("devicename",null);
        String apikey = this.getKey("__apikey",null);

        ConnectorDB cdb = new ConnectorDB("", apikey, server);

        try {

            // Try pinging the server - if it works, and the device names match, we're good to go!
            if (!cdb.ping().equals(devicename)) {
                throw new Exception("Devices not equal");
            }

            // OK - we're good to go!

            SQLiteDatabase db = this.getWritableDatabase();

            //For each stream in database
            Cursor res = db.rawQuery("SELECT streamname FROM streams", new String[] {});
            int resultcount = res.getCount();
            if (resultcount == 0) {
                Log.i(TAG, "No streams to sync");
                return true;
            }

            for (int i = 0; i < resultcount; i++) {
                res.moveToNext();
                String streamname = res.getString(0);

                Log.v(TAG, "Syncing stream " + streamname);

                // Get the datapoints for the stream - and don't include any weird future datapoints if they exist
                double queryTime = ((double) System.currentTimeMillis()) / 1000.0;

                Cursor dta = db.rawQuery(
                        "SELECT timestamp,data FROM cache WHERE streamname=? AND timestamp <=? ORDER BY timestamp ASC;",
                        new String[] { streamname, Double.toString(queryTime) });
                int dtacount = dta.getCount();

                if (dtacount > 0) {
                    try {
                        Stream s = cdb.getStream(devicename + "/" + streamname);
                    } catch (RequestFailedException ex) {
                        // The request failed. This is presumably because the stream doesn't exist.
                        // therefore, we try creating it!
                        Log.w(TAG, "Stream does not exist: " + streamname + " because error was " + ex.response.msg
                                + ". Creating stream.");
                        Cursor streamcursor = db.rawQuery("SELECT * FROM streams WHERE streamname=?",
                                new String[] { streamname });
                        if (!streamcursor.moveToFirst()) {
                            throw new Exception("STREAM DOES NOT EXIST IN DATABASE!");
                        }
                        Stream s = new Stream();
                        s.setSchema(streamcursor.getString(streamcursor.getColumnIndex("schema")));
                        s.setDatatype(streamcursor.getString(streamcursor.getColumnIndex("datatype")));
                        s.setIcon(streamcursor.getString(streamcursor.getColumnIndex("icon")));
                        s.setNickname(streamcursor.getString(streamcursor.getColumnIndex("nickname")));
                        s.setDescription(streamcursor.getString(streamcursor.getColumnIndex("description")));
                        streamcursor.close();

                        cdb.createStream(devicename + "/" + streamname, s);
                    }

                    Log.i(TAG, "Writing " + dtacount + " datapoints to " + streamname);

                    //Get the most recently inserted timestamp
                    double oldtime = 0;
                    String keyname = "sync_oldtime_" + streamname;
                    try {
                        oldtime = Double.parseDouble(getKey(keyname,null));
                    } catch (NumberFormatException nfe) {
                    }

                    // Now see if there exists a newer timestamp for the stream
                    double streamtime = cdb.getMostRecentTimestamp(devicename + "/" + streamname);
                    if (streamtime > oldtime) {
                        Log.w(TAG, "Stream on server has newer timestamps! Skipping until time!");
                        oldtime = streamtime;
                    }

                    StringBuilder totaldata = new StringBuilder();
                    totaldata.append("[");
                    for (int j = 0; j < dtacount; j++) {
                        dta.moveToNext();
                        double timestamp = dta.getDouble(0);
                        if (timestamp > oldtime) {
                            oldtime = timestamp;
                            totaldata.append("{\"t\": ");
                            totaldata.append(timestamp);
                            totaldata.append(", \"d\": ");
                            totaldata.append(dta.getString(1));
                            totaldata.append("},");
                        } else {
                            Log.w(TAG, streamname + ": Skipping duplicate timestamp");
                        }
                    }
                    String totaldatas = totaldata.toString();
                    totaldatas = totaldatas.substring(0, totaldata.length() - 1) + "]";

                    if (totaldatas.length() > 1) {
                        cdb.insertJson(devicename + "/" + streamname, totaldatas);

                        //Now delete the data from the cache
                        db.execSQL("DELETE FROM cache WHERE streamname=? AND timestamp <=?",
                                new Object[] { streamname, oldtime });

                        setKey(keyname, Double.toString(oldtime), null);
                    }

                }
            }

        } catch (Exception ex) {
            Log.e(TAG, "sync: ", ex);
            return false;
        }

        Log.v(TAG, "Sync successful - " + Integer.toString(size()) + " datapoints left");
        return true;
    }
}