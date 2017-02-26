package com.connectordb_android.loggers;

import java.util.LinkedList;
import java.util.ListIterator;

/**
 * LoggingManager handles everything that has to do with logging. It exposes all relevant settings
 * and is used as a singleton for the whole application.
 */
public class LoggingManager {

    /**
     * get returns the full logging manager - if it doesn't exist, creates it
     */
    private static LoggingManager loggingManager;
    public static synchronized LoggingManager get() {
        if (loggingManager == null) {
            loggingManager = new LoggingManager();
        }
        return loggingManager;
    }


    public LinkedList<BaseLogger> loggers = new LinkedList<BaseLogger>();


    public void add(BaseLogger b) {
        b.init();
        loggers.add(b);
    }


    public void close() {
        // Run the close function for all loggers
        ListIterator<BaseLogger> iter = loggers.listIterator();
        while (iter.hasNext()) {
            iter.next().close();
        }
    }
}