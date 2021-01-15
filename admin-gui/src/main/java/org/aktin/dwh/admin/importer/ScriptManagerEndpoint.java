package org.aktin.dwh.admin.importer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;
import org.aktin.dwh.admin.importer.enums.ScriptKey;
import org.aktin.dwh.admin.importer.pojos.PropertiesFilePOJO;
import org.aktin.dwh.admin.importer.pojos.ScriptFilePOJO;
//import org.aktin.scripts.PythonScriptExecutor;
//import org.aktin.scripts.ScriptMethod;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
//import javax.ws.rs.core.SecurityContext;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;

/**
 * TODO Comments
 * TODO DO NOT FORGET DWH-API:0.7-SNAPSHOT
 * TODO Aufräumen?
 */

@Path("script")
public class ScriptManagerEndpoint {

    private static final Logger LOGGER = Logger.getLogger(ScriptManagerEndpoint.class.getName());
    private final ScriptKey[] SCRIPT_KEYS = {ScriptKey.VIEWNAME, ScriptKey.VERSION};

    @Inject
    private FileOperationManager fileOperationManager;

    //@Inject
    //private PythonScriptExecutor pythonScriptExecutor;

    //@Context
    //private SecurityContext security;

    /**
     * GET request for a list of import scripts
     * iterates recursively through directory {importScriptPath} to catch all regular files
     * iterates through the first fifteen lines of each file (first one is skipped) to extract the keys "DESC" and "VERSION"
     * Example: #@DESC=TEST TEST -> { "DESC":"TEST TEST" }
     * identifier of DESC and VERSION is the name of the script i.e. "script.py"
     * writes values in a json in format { NAME_OF_SCRIPT : { DESC, VERSION } } and returns it
     * <p>
     * both keys are mandatory, if one key is missing, whole element is skipped
     * if no files exist, empty json is returned
     * if directory {importScriptPath} does not exists (noSuchFileException), empty json is returned
     * TODO make POJOs
     *
     * @return Response object with list of meta-data as json
     */

    @Path("get")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public ArrayList<ScriptFilePOJO> getImportScripts() throws IOException {
        ArrayList<ScriptFilePOJO> list_scriptPOJOs = new ArrayList<>();
        ArrayList<String> list_scripts = fileOperationManager.getScriptIDs();
        for (String script : list_scripts) {
            HashMap<String,String> map_script = fileOperationManager.checkScriptFileForIntegrity(script);
            if (map_script != null && !map_script.isEmpty()) {
                ScriptFilePOJO pojo_script = fileOperationManager.createScriptPOJO(map_script);
                list_scriptPOJOs.add(pojo_script);
            } else {
                LOGGER.log(Level.INFO, "{0} misses some keys", script);
            }
        }
        return list_scriptPOJOs;
    }


    /**
     * POST request to verify uploaded file using an extern script
     * UNFINISHED
     *
     * @param uuid: uuid of file to verify
     * @return Response with status 200
     * woher kommt exception und was bedeutet sie?

    @Path("{uuid}/verify")
    @POST
    public Response queueFileVerification(@NotNull @PathParam("uuid") String uuid) throws IOException {
        pythonScriptExecutor.addTask(uuid, ScriptMethod.verify_file);
        return Response.status(Response.Status.ACCEPTED).build();
    }
     */

    /**
     * POST request to import uploaded file using an extern script
     * UNFINISHED
     *
     * @param uuid: uuid of file to import
     * @return Response with status 200

    @Path("{uuid}/import")
    @POST
    public Response queueFileImport(@NotNull @PathParam("uuid") String uuid) {
        try {
            pythonScriptExecutor.addTask(uuid, ScriptMethod.import_file);
            return Response.status(Response.Status.ACCEPTED).build();
        } catch (Exception e) {
            fileOperationManager.changeStateProperty(uuid, ImportState.failed);
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }
     */

    /**
     * POST request to cancel script processing of uuid
     *
     * @param uuid: uuid of file to verify
     * @return Response with status 200

    @Path("{uuid}/cancel")
    @POST
    public Response cancelFileProcessing(@NotNull @PathParam("uuid") String uuid) {
        try {
            pythonScriptExecutor.cancelTask(uuid);
            return Response.status(Response.Status.ACCEPTED).build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }
     */

    /**
     * GET request for status of script processing
     *
     * @param uuid: uuid of file to verify
     * @return Response with status 200

    @Path("{uuid}/status")
    @GET
    public Response getFileProcessingStatus(@NotNull @PathParam("uuid") String uuid) {
        try {
            Boolean result = pythonScriptExecutor.isTaskDone(uuid);
            return Response.status(Response.Status.OK).entity(result).build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }
     */
}
