package org.aktin.dwh.admin.importer;

import org.aktin.dwh.admin.importer.pojos.ScriptFilePOJO;
import org.aktin.scripts.PythonScriptExecutor;
import org.aktin.scripts.ScriptOperation;

import javax.validation.constraints.NotNull;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.logging.Logger;

/**
 * TODO Comments
 * TODO DO NOT FORGET DWH-API:0.7-SNAPSHOT
 */

@Path("script")
public class ScriptManagerEndpoint {

    private static final Logger LOGGER = Logger.getLogger(ScriptManagerEndpoint.class.getName());

    @Inject
    private ScriptOperationManager scriptOperationManager;

    @Inject
    private PythonScriptExecutor pythonScriptExecutor;

    @Context
    private SecurityContext security;

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
     *
     * @return Response object with list of meta-data as json
     */

    @Path("get")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public ArrayList<ScriptFilePOJO> getImportScripts() {
        ArrayList<ScriptFilePOJO> list_scriptPOJOs = new ArrayList<>();
        for (HashMap<String, String> map_script : scriptOperationManager.getHashMaps()) {
            ScriptFilePOJO pojo_script = scriptOperationManager.createScriptPOJO(map_script);
            list_scriptPOJOs.add(pojo_script);
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
     */
    @Path("{uuid}/verify")
    @POST
    public Response queueFileVerification(@NotNull @PathParam("uuid") String uuid) {
        pythonScriptExecutor.addTask(uuid, ScriptOperation.verify_file);
        return Response.status(Response.Status.ACCEPTED).build();
    }

    /**
     * POST request to import uploaded file using an extern script
     * UNFINISHED
     *
     * @param uuid: uuid of file to import
     * @return Response with status 200
     */
    @Path("{uuid}/import")
    @POST
    public Response queueFileImport(@NotNull @PathParam("uuid") String uuid) {
        pythonScriptExecutor.addTask(uuid, ScriptOperation.import_file);
        return Response.status(Response.Status.ACCEPTED).build();
    }

    /**
     * POST request to cancel script processing of uuid
     *
     * @param uuid: uuid of file to verify
     * @return Response with status 200
     */
    @Path("{uuid}/cancel")
    @POST
    public Response cancelFileProcessing(@NotNull @PathParam("uuid") String uuid) {
        pythonScriptExecutor.cancelTask(uuid);
        return Response.status(Response.Status.ACCEPTED).build();
    }

    /**
     * GET request for status of script processing
     *
     * @param uuid: uuid of file to verify
     * @return Response with status 200
     */
    @Path("{uuid}/status")
    @GET
    public Response getFileProcessingStatus(@NotNull @PathParam("uuid") String uuid) {
        boolean result = pythonScriptExecutor.isTaskDone(uuid);
        return Response.status(Response.Status.OK).entity(result).build();
    }
}
