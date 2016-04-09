package com.connectordb_android.logger;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.DatabaseUtils;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.os.AsyncTask;
import android.os.Handler;
import android.util.Log;

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
    public static final int DATABASE_VERSION = 1;
    public static final String TAG = "DatapointCache";
    public static final String DATABASE_NAME = "DatapointCache.db";

    //The class is used as a singleton in the application
    private static DatapointCache datapointCache;
    public static synchronized DatapointCache get(Context c) {
        if (datapointCache==null) {
            if (c==null) {
                Log.e(TAG,"Context not supplied to DatapointCache!");
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

        long syncenabled = 0;
        try {
            syncenabled = Long.parseLong(this.getKey("syncenabled"));
        } catch(NumberFormatException nfe) {}

        if (syncenabled > 0) {
            Log.i(TAG, "Sync is Enabled");
            this.startSyncWait();
        } else {
            Log.i(TAG,"Sync is disabled");
        }

    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        Log.v(TAG, "Creating new logger cache database");
        db.execSQL("CREATE TABLE streams (streamname TEXT PRIMARY KEY, schema TEXT, datatype TEXT, icon TEXT);");
        db.execSQL("CREATE TABLE cache (streamname TEXT, timestamp REAL, data TEXT);");
        db.execSQL("CREATE TABLE kv (key TEXT PRIMARY KEY, value TEXT);");

        //Now fill in the default values in kv for syncing
        db.execSQL("INSERT INTO kv VALUES ('server','https://connectordb.com');");
        db.execSQL("INSERT INTO kv VALUES ('devicename','');");
        db.execSQL("INSERT INTO kv VALUES ('__apikey','');");
        db.execSQL("INSERT INTO kv VALUES ('syncperiod','3600');"); // Make the database sync every hour
        db.execSQL("INSERT INTO kv VALUES ('syncenabled','0');"); // Sync is disabled by default
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        Log.w(TAG, "Upgrading Cache - deleting old tables...");
        db.execSQL("DROP TABLE IF EXISTS cache;");
        db.execSQL("DROP TABLE IF EXISTS streams;");
        db.execSQL("DROP TABLE IF EXISTS kv;");
        onCreate(db);
    }

    /**
     * getKey returns the value for the given key from the KV store.
     * @param key
     * @return the value - empty string if DNE
     */
    public String getKey(String key) {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor res = db.rawQuery("SELECT value FROM kv WHERE key=?;", new String[]{key});
        if (res.getCount() ==0 ) {
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
    public void setKey(String key,String value, SQLiteDatabase db) {
        if (db==null) db = this.getWritableDatabase();
        if (key.startsWith("__")) {
            Log.v(TAG, "SET " + key + " TO ********");
        }else{
            Log.v(TAG, "SET " + key + " TO " + value);
        }
        ContentValues contentValues = new ContentValues();
        contentValues.put("key", key);
        contentValues.put("value", value);
        db.replace("kv",null,contentValues);
    }

    public void setCred(String device, String apikey) {
        this.setKey("devicename",device,null);
        this.setKey("__apikey",apikey,null);
    }


    /**
     * ensureStream adds the stream to the DatapointCache. This will make the stream be created
     * if it doesn't exist, and synced to ConnectorDB
     *
     * @param stream the stream name
     * @param schema the jsonSchema
     * @param datatype connectorDB datatype for the stream
     * @param icon urlencoded icon to use for the stream
     */
    public void ensureStream(String stream,String schema, String datatype, String icon) {
        Log.v(TAG, "Ensuring stream " + stream);

        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
        contentValues.put("streamname", stream);
        contentValues.put("schema", schema);
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
     * insert the given datapoint into the cache. When isnerting datapoints, make sure to run
     * ensureStream first, to register the stream from which the datapoints come. Otherwise DatapointCache
     * won't recognize the points.
     * @param stream
     * @param timestamp
     * @param data
     * @param db An optional database (set to null) to use (for transactions)
     * @return whether insert was successful
     */
    public synchronized boolean insert(String stream, long timestamp, String data, SQLiteDatabase db) {
        if (db==null) db = this.getWritableDatabase();
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
                    DatapointCache.this.sync();
                    DatapointCache.this.startSyncWait();
                    return null;
                }
            }.execute();
        }
    };

    public void startSyncWait() {


        long waittime = Long.parseLong(this.getKey("syncperiod"));

        if (waittime > 0) {
            Log.v(TAG,"Setting next sync in "+ waittime);
            handler.postDelayed(syncer,waittime);
        }
    }

    public void disableTimedSync() {
        Log.v(TAG, "Disabling syncer");
        handler.removeCallbacks(syncer);
        this.setKey("syncenabled", "0",null);

    }

    public void enableTimedSync(long time) {
        disableTimedSync();
        this.setKey("syncenabled", "1",null);
        this.setKey("syncperiod",Long.toString(time),null);
        startSyncWait();
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

    //Synchronizes the database with the server
    public synchronized boolean sync() {
        Log.v(TAG,"Starting sync");
        String server = this.getKey("server");
        String devicename = this.getKey("devicename");
        String apikey = this.getKey("__apikey");

        /*
        ConnectorDB cdb;
        try {
            cdb=new ConnectorDB(server,devicename,apikey);
        } catch (IllegalStateException e) {
            Log.e(TAG,"Could not initialize connectordb");
            return false;
        }

        if (!cdb.Ping()) {
            Log.e(TAG,"Ping failed");
            return false;
        }*/

        SQLiteDatabase db = this.getWritableDatabase();

        //For each stream in database
        Cursor res = db.rawQuery("SELECT streamname FROM streams", new String[]{});
        int resultcount = res.getCount();
        if (resultcount ==0 ) {
            Log.i(TAG,"No streams to sync");
            return true;
        }

        for (int i =0; i<resultcount; i++) {
            res.moveToNext();
            String streamname = res.getString(0);

            Log.v(TAG,"Syncing stream "+streamname);


            // Get the datapoints for the stream - and don't include any weird future datapoints if they exist
            double queryTime = ((double)System.currentTimeMillis())/1000.0;

            Cursor dta = db.rawQuery("SELECT timestamp,data FROM cache WHERE streamname=? AND timestamp <=? ORDER BY timestamp ASC;", new String[]{streamname,Double.toString(queryTime)});
            int dtacount = dta.getCount();

            if (dtacount > 0) {
                /*
                // Check if the stream exists
                if (!cdb.HasStream(streamname)) {
                    Log.w(TAG,"Stream does not exist: "+streamname);
                    //Create the stream
                    Cursor res2 = db.rawQuery("SELECT schema,datatype,icon FROM streams WHERE streamname=?", new String[]{},String[]{streamname});
                    res2.moveToNext();
                    String schema = res.getString(0);
                    String datatype = res.getString(1);
                    String icon = res.getString(2);
                    if (!cdb.CreateStream(streamname,schema)) {
                        Log.e(TAG,"Creating stream failed: "+streamname);
                        return false;
                    }
                    res2.close();
                }
            */
            }

            Log.i(TAG,"Writing "+dtacount+" datapoints to "+streamname);

            //Get the most recently inserted timestamp
            double oldtime = 0;
            String keyname = "sync_oldtime_"+streamname;
            try {
                oldtime = Double.parseDouble(getKey(keyname));
            } catch(NumberFormatException nfe) {}

            StringBuilder totaldata = new StringBuilder();
            totaldata.append("[");
            for (int j=0; j< dtacount; j++) {
                dta.moveToNext();
                double timestamp = dta.getDouble(0);
                if (timestamp>oldtime) {
                    oldtime = timestamp;
                    totaldata.append("{\"t\": ");
                    totaldata.append(timestamp);
                    totaldata.append(", \"d\": ");
                    totaldata.append(dta.getString(1));
                    totaldata.append("},");
                } else {
                    Log.w(TAG,streamname+": Skipping duplicate timestamp");
                }
            }
            String totaldatas = totaldata.toString();
            totaldatas = totaldatas.substring(0, totaldata.length()-1)+"]";

            if (totaldatas.length()>1) {
                /*
                if (!cdb.insert(streamname,totaldatas)) {
                    Log.e(TAG,"FAILED TO INSERT "+streamname);
                    return false;
                }

                //Now delete the data from the cache
                db.execSQL("DELETE FROM cache WHERE streamname=? AND timestamp <=?",new Object[]{streamname, oldtime});

                setKey(keyname, Double.toString(oldtime));
                */
            }

        }

        Log.v(TAG,"Sync successful");
        return true;
    }
}