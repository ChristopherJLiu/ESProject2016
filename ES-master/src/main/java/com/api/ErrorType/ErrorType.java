package com.api.ErrorType;

import com.google.gson.JsonObject;

/**
 * Created by nunomota on 10/24/2016.
 */
public enum ErrorType {

    MISSING_API_TOKEN(400, "Missing private API token.", "Please add 'private_token=XXX' as a query parameter."),
    MISSING_PROJECT_ID(400, "Missing project ID parameter.", "Please add your project's id as a path parameter."),
    MISSING_FILE_PATH(400, "Missing file path parameter.", "Please add 'file_path=XXX' as a query parameter."),
    CONNECTION_FAILED_INVALID_URL(400, "Invalid API request", "Check all your parameters"),
    CONNECTION_FAILED_UNKNOWN_HOST(400, "Unknown host specified", "Check your target host's URL"),
    CONNECTION_FAILED_UNKNOWN_ERROR(500, "Unknown error", "Contact a system administrator");

    private static final String DEFAULT_INVALID_URL_EXCEPTION = "Server returned HTTP response code: 401 for URL";
    private static final String DEFAULT_UNKNOWN_HOST_EXCEPTION = "No subject alternative DNS name matching";

    private final int code;
    private final String cause;
    private final String solution;

    private ErrorType(int code, String cause, String solution) {
        this.code = code;
        this.cause = cause;
        this.solution = solution;
    }

    public String toJSON() {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("code", code);
        jsonObject.addProperty("cause", cause);
        jsonObject.addProperty("solution", solution);

        return jsonObject.toString();
    }

    public static ErrorType FromException(Exception e) {
        if (e.toString().contains(DEFAULT_INVALID_URL_EXCEPTION)) {
            return ErrorType.CONNECTION_FAILED_INVALID_URL;
        } else if (e.toString().contains(DEFAULT_UNKNOWN_HOST_EXCEPTION)) {
            return ErrorType.CONNECTION_FAILED_UNKNOWN_HOST;
        } else {
            return ErrorType.CONNECTION_FAILED_UNKNOWN_ERROR;
        }
    }
}
