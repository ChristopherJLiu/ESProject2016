package com.api.ExceptionHandler;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * Created by nunomota on 10/24/2016.
 */
public class ExceptionHandler {

    public static synchronized String getStackTraceAsString(Exception e) {
        StringWriter exception = new StringWriter();
        e.printStackTrace(new PrintWriter(exception));
        return exception.toString();
    }
}
