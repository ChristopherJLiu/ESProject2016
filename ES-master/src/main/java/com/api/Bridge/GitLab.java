package com.api.Bridge;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by nunomota on 10/24/2016.
 */
public class GitLab {

    private static final long MIN_REQUEST_INTERVAL_IN_MILLIS = 1000;

    private static final Logger LOGGER = LogManager.getLogger(GitLab.class);

    public static String Get(String targetUrl) throws IOException {
        try {
            Thread.sleep(MIN_REQUEST_INTERVAL_IN_MILLIS);
        } catch (Exception e) {
            LOGGER.warn(String.format("Could not put thread '%s' to sleep...", Thread.currentThread().getName()));
        }
        StringBuilder result = new StringBuilder();
        URL url = new URL(targetUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String line;
        while ((line = rd.readLine()) != null) {
            result.append(line);
        }
        rd.close();

        return result.toString();
    }
}
