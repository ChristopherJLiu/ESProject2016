package com.api;

import com.api.Bridge.GitLab;
import com.api.ErrorType.ErrorType;
import com.api.ExceptionHandler.ExceptionHandler;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.StringJoiner;

/**
 * Resource exposed at "v1" path. This class handles API
 * support for 'gitlab.com'.
 */
@Path("v1/projects/{project_id}")
public class ApiHandlerV1 {

    private static final Logger LOGGER = LogManager.getLogger(ApiHandlerV1.class);

    private static final String DEFAULT_PARAM_VALUE = "NULL";
    private static final String DEFAULT_MAX_COMMIT_VALUE = "20";

    private static final String API_TREE_REQUEST_FORMAT = "https://gitlab.com/api/v3/projects/%s/repository/tree/?private_token=%s";
    private static final String API_SUBTREE_REQUEST_FORMAT = API_TREE_REQUEST_FORMAT + "&path=%s";

    private static final String API_COMMIT_PAGE_REQUEST_FORMAT = "https://gitlab.com/api/v3/projects/%s/repository/commits/?private_token=%s&page=%d";
    private static final String API_COMMIT_INFO_REQUEST_FORMAT = "https://gitlab.com/api/v3/projects/%s/repository/commits/%s/diff/?private_token=%s";

    /**
     * Used to get all the files in a given directory.
     *
     * @return String JSON object containing a list of artifacts.
     */
    @GET
    @Path("/tree")
    @Produces(MediaType.APPLICATION_JSON)
    public String getFilesInProject(@DefaultValue(DEFAULT_PARAM_VALUE) @QueryParam(value = "private_token") String apiToken,
                                    @DefaultValue(DEFAULT_PARAM_VALUE) @PathParam(value = "project_id") String projectId,
                                    @DefaultValue(DEFAULT_PARAM_VALUE) @QueryParam(value = "directory") String directory) {

        // Check mandatory parameters
        if (apiToken.equals(DEFAULT_PARAM_VALUE)) {
            LOGGER.debug(String.format("REQUEST{type: GET_FILES_IN_PROJECT; private_token: %s; project_id: %s; directory: %s}; REPLY{type: ERROR; content: \"%s\"}", apiToken, projectId, directory, ErrorType.MISSING_API_TOKEN.toJSON()));
            return ErrorType.MISSING_API_TOKEN.toJSON();
        } else if (projectId.equals(DEFAULT_PARAM_VALUE)) {
            LOGGER.debug(String.format("REQUEST{type: GET_FILES_IN_PROJECT; private_token: %s; project_id: %s; directory: %s}; REPLY{type: ERROR; content: \"%s\"}", apiToken, projectId, directory, ErrorType.MISSING_PROJECT_ID.toJSON()));
            return ErrorType.MISSING_PROJECT_ID.toJSON();
        }

        // Build correct request string
        String apiRequest;
        if (directory.equals(DEFAULT_PARAM_VALUE)) {
            apiRequest = String.format(API_TREE_REQUEST_FORMAT, projectId, apiToken);
        } else {
            apiRequest = String.format(API_SUBTREE_REQUEST_FORMAT, projectId, apiToken, directory);
        }

        // Connect to GitLab's API
        try {
            String apiReply = GitLab.Get(apiRequest);
            LOGGER.debug(String.format("REQUEST{type: GET_FILES_IN_PROJECT; private_token: %s; project_id: %s; directory: %s}; REPLY{type: OK; content: \"%s\"}", apiToken, projectId, directory, apiReply));
            return apiReply;
        } catch (IOException e) {
            LOGGER.debug(String.format("REQUEST{type: GET_FILES_IN_PROJECT; private_token: %s; project_id: %s; directory: %s}; REPLY{type: EXCEPTION; content: \"%s\"}", apiToken, projectId, directory, ErrorType.FromException(e).toJSON()));
            LOGGER.error(ExceptionHandler.getStackTraceAsString(e));
            return ErrorType.FromException(e).toJSON();
        }
    }

    /**
     * Used to get all the commits associated with a file's lifecycle.
     * If the number of desired commits is not specified, that value will default to 20.
     *
     * @return String JSON object containing a list of commits.
     */
    @GET
    @Path("/commits")
    @Produces(MediaType.APPLICATION_JSON)
    public String getFileCommitHistory(@DefaultValue(DEFAULT_PARAM_VALUE) @QueryParam(value = "private_token") String apiToken,
                                       @DefaultValue(DEFAULT_PARAM_VALUE) @PathParam(value = "project_id") String projectId,
                                       @DefaultValue(DEFAULT_PARAM_VALUE) @QueryParam(value = "file_path") String file,
                                       @DefaultValue(DEFAULT_MAX_COMMIT_VALUE) @QueryParam(value = "max_commits") String maxCommits) {

        // Check mandatory parameters
        if (apiToken.equals(DEFAULT_PARAM_VALUE)) {
            LOGGER.debug(String.format("REQUEST{type: GET_FILE_COMMIT_HISTORY; private_token: %s; project_id: %s; file_path: %s; max_commits: %s}; REPLY{type: ERROR; content: \"%s\"}", apiToken, projectId, file, maxCommits, ErrorType.MISSING_API_TOKEN.toJSON()));
            return ErrorType.MISSING_API_TOKEN.toJSON();
        } else if (projectId.equals(DEFAULT_PARAM_VALUE)) {
            LOGGER.debug(String.format("REQUEST{type: GET_FILE_COMMIT_HISTORY; private_token: %s; project_id: %s; file_path: %s; max_commits: %s}; REPLY{type: ERROR; content: \"%s\"}", apiToken, projectId, file, maxCommits, ErrorType.MISSING_PROJECT_ID.toJSON()));
            return ErrorType.MISSING_PROJECT_ID.toJSON();
        } else if (file.equals(DEFAULT_PARAM_VALUE)) {
            LOGGER.debug(String.format("REQUEST{type: GET_FILE_COMMIT_HISTORY; private_token: %s; project_id: %s; file_path: %s; max_commits: %s}; REPLY{type: ERROR; content: \"%s\"}", apiToken, projectId, file, maxCommits, ErrorType.MISSING_FILE_PATH.toJSON()));
            return ErrorType.MISSING_FILE_PATH.toJSON();
        }

        try {
            String apiReply = collectMatchingCommits(apiToken, projectId, file, Integer.parseInt(maxCommits));
            LOGGER.debug(String.format("REQUEST{type: GET_FILE_COMMIT_HISTORY; private_token: %s; project_id: %s; file_path: %s; max_commits: %s}; REPLY{type: OK; content: \"%s\"}", apiToken, projectId, file, maxCommits, apiReply));
            return apiReply;
        } catch (IOException e) {
            LOGGER.debug(String.format("REQUEST{type: GET_FILE_COMMIT_HISTORY; private_token: %s; project_id: %s; file_path: %s; max_commits: %s}; REPLY{type: EXCEPTION; content: \"%s\"}", apiToken, projectId, file, maxCommits, ErrorType.FromException(e).toJSON()));
            LOGGER.error(ExceptionHandler.getStackTraceAsString(e));
            return ErrorType.FromException(e).toJSON();
        }
    }

    /**
     * Used to run through every commit on a GitLab's repository and return every commit where a given file was changed.
     *
     * @param apiToken private GitLab's API token.
     * @param projectId the ID of the target project.
     * @param filePath the path of the target file.
     * @param maxCommits the maximum number of commits to return.
     * @return JSON containing a list of commits returned by GitLab's API (that contain changes to a given file).
     */
    private String collectMatchingCommits(String apiToken, String projectId, String filePath, int maxCommits) throws IOException {
        boolean endOfHistoryReached = false;
        int foundCommits = 0;
        StringJoiner matchingCommitJson = new StringJoiner(",", "[", "]");

        int curPage = 1;
        String curFilePath = filePath;
        while(foundCommits < maxCommits && !endOfHistoryReached) {
            // Connect to GitLab's API
            String apiCommitsRequest = String.format(API_COMMIT_PAGE_REQUEST_FORMAT, projectId, apiToken, curPage);
            String apiCommitsReply = GitLab.Get(apiCommitsRequest);

            // request a given page of commits from API
            JsonArray commitArray = new JsonParser().parse(apiCommitsReply).getAsJsonArray();
            if (commitArray.size() != 0) {
                // run through every commit
                String apiCommitInfoRequest;
                String apiCommitInfoReply;
                JsonArray diffArray;
                for (JsonElement commit : commitArray) {
                    boolean commitAlreadyAdded = false;
                    String commitId = commit.getAsJsonObject().get("id").getAsString();
                    apiCommitInfoRequest = String.format(API_COMMIT_INFO_REQUEST_FORMAT, projectId, commitId, apiToken);
                    apiCommitInfoReply = GitLab.Get(apiCommitInfoRequest);

                    // run through every diff
                    diffArray = new JsonParser().parse(apiCommitInfoReply).getAsJsonArray();
                    for (JsonElement diff : diffArray) {
                        // add commit to JSON object and make necessary updates to a file's name
                        if (diff.getAsJsonObject().get("new_path").getAsString().equals(curFilePath) &&
                                foundCommits < maxCommits) {
                            if (!commitAlreadyAdded) {
                                System.out.println("Adding: " + commit);
                                matchingCommitJson.add(String.format("%s", commit));
                                commitAlreadyAdded = true;
                            }
                            foundCommits++;
                            if (diff.getAsJsonObject().get("renamed_file").getAsBoolean()) {
                                curFilePath = diff.getAsJsonObject().get("old_path").getAsString();
                            }
                        }
                        System.out.println(String.format("%s -> %s", diff.getAsJsonObject().get("old_path"), diff.getAsJsonObject().get("new_path")));
                    }
                }
            } else {
                endOfHistoryReached = true;
            }
            curPage++;
        }

        return matchingCommitJson.toString();
    }
}
