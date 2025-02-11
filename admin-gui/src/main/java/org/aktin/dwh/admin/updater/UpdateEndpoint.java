package org.aktin.dwh.admin.updater;

import org.aktin.dwh.admin.auth.Secured;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

/**
 * REST endpoint for managing DWH (Data Warehouse) update operations.
 * Provides endpoints for checking update agent installation status,
 * retrieving update status, managing update logs, and executing updates.
 *
 * All update-related operations will fail with  SERVICE_UNAVAILABLE if
 * the debian update agent package is not installed.
 */
@Path("update")
public class UpdateEndpoint {

    @Inject
    UpdateManager updateManager;

    @Context
    private SecurityContext security;

    /**
     * Checks if the update agent is installed in the system.
     *
     * @return Response with status 200 OK and boolean indicating if agent is installed
     */
    @Path("agent/installed")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response isUpdateAgentInstalled() {
        return Response.ok(updateManager.isUpdateAgentInstalled()).build();
    }

    /**
     * Retrieves the current update status of the system.
     *
     * @return Response with status:
     *         - 200 OK with UpdateStatus JSON if status is available
     *         - 404 NOT_FOUND if no status information exists
     *         - 503 SERVICE_UNAVAILABLE if update agent is not installed
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUpdateStatus() {
        if (!updateManager.isUpdateAgentInstalled()) {
            return Response.status(Response.Status.SERVICE_UNAVAILABLE).build();
        }
        UpdateStatus status = updateManager.getUpdateStatus();
        return status != null ?
            Response.ok(status).build() :
            Response.status(Response.Status.NOT_FOUND).build();
    }

    /**
     * Retrieves the update operation log.
     *
     * @return Response with status:
     *         - 200 OK with log text if available
     *         - 404 NOT_FOUND if no log exists
     *         - 503 SERVICE_UNAVAILABLE if update agent is not installed
     */
    @Path("log")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response getUpdateLog() {
        if (!updateManager.isUpdateAgentInstalled()) {
            return Response.status(Response.Status.SERVICE_UNAVAILABLE).build();
        }
        String log = updateManager.getUpdateLog();
        return log != null ?
            Response.ok(log).build() :
            Response.status(Response.Status.NOT_FOUND).build();
    }

    /**
     * Triggers a reload of debian apt package lists.
     *
     * @return Response with status:
     *         - 202 ACCEPTED if reload was initiated successfully
     *         - 500 SERVER_ERROR if reload failed
     *         - 503 SERVICE_UNAVAILABLE if update agent is not installed
     */
    @Path("agent/reload")
    @POST
    @Secured
    public Response reloadAptPackageLists() {
        if (!updateManager.isUpdateAgentInstalled()) {
            return Response.status(Response.Status.SERVICE_UNAVAILABLE).build();
        }
        boolean success = updateManager.reloadAptPackageLists();
        return success ?
            Response.accepted().build() :
            Response.serverError().build();
    }

    /**
     * Triggers an update of the dwh debian package
     *
     * @return Response with status:
     *         - 202 ACCEPTED if update was initiated successfully
     *         - 409 CONFLICT if an update is already in progress
     *         - 500 SERVER_ERROR if update failed to start
     *         - 503 SERVICE_UNAVAILABLE if update agent is not installed
     */
    @POST
    @Secured
    public Response executeDwhUpdate() {
        if (!updateManager.isUpdateAgentInstalled()) {
            return Response.status(Response.Status.SERVICE_UNAVAILABLE).build();
        }
        if (updateManager.isUpdateInProgress()) {
            return Response.status(Response.Status.CONFLICT).build();
        }
        boolean success = updateManager.executeDwhUpdate();
        return success ?
            Response.accepted().build() :
            Response.serverError().build();
    }

}
