package org.aktin.dwh.admin.importer;

import org.aktin.dwh.admin.auth.Secured;
import org.aktin.importer.ScriptOperationManager;
import org.aktin.importer.enums.ScriptOperation;
import org.aktin.importer.executor.PythonScriptExecutor;
import org.aktin.importer.pojos.ScriptFile;

import javax.validation.constraints.NotNull;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;
import java.util.List;
import java.util.logging.Logger;

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
     * GET request for import scripts detected by scriptOperationManager
     * Each item contains id, version, name in view and processed mimetype of corresponding script
     * (see ScriptFile in generic-file-importer)
     *
     * @return List of uploaded script data
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ScriptFile> getImportScripts() {
        pythonScriptExecutor.getQueueSize();
        return scriptOperationManager.getScripts();
    }

    /**
     * POST request to start file verification using corresponding script
     *
     * @param uuid universally unique id of file to verify
     */
    @Secured
    @Path("{uuid}/verify")
    @POST
    public void queueFileVerification(@NotNull @PathParam("uuid") String uuid) {
        pythonScriptExecutor.addTask(uuid, ScriptOperation.verify_file);
    }

    /**
     * POST request to start file import using corresponding script
     *
     * @param uuid: universally unique id of file to import
     */
    @Secured
    @Path("{uuid}/import")
    @POST
    public void queueFileImport(@NotNull @PathParam("uuid") String uuid) {
        pythonScriptExecutor.addTask(uuid, ScriptOperation.import_file);
    }

    /**
     * POST request to cancel file processing
     *
     * @param uuid universally unique id of file
     */
    @Secured
    @Path("{uuid}/cancel")
    @POST
    public void cancelFileProcessing(@NotNull @PathParam("uuid") String uuid) {
        pythonScriptExecutor.cancelTask(uuid);
    }

    /**
     * @return length of PythonRunner's current Queue
     */
    @Path("queue")
    @GET
    public int getRunnerQueue() {
        return pythonScriptExecutor.getQueueSize();
    }
}
