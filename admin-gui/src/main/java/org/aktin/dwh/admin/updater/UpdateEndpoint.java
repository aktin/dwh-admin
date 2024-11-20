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

@Path("update")
public class UpdateEndpoint {

    @Inject
    UpdateManager updateManager;

    @Context
    private SecurityContext security;

    @Path("agent/installed")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public boolean isUpdateAgentInstalled() {
        return updateManager.isUpdateAgentInstalled();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUpdateStatus() {
        UpdateStatus status = updateManager.getUpdateStatus();
        return status != null ?
            Response.ok(status).build() :
            Response.status(Response.Status.NOT_FOUND).build();
    }

    @Path("log")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response getUpdateLog() {
        String log = updateManager.getUpdateLog();
        return log != null ?
            Response.ok(log).build() :
            Response.status(Response.Status.NOT_FOUND).build();
    }

    @Path("agent/reload")
    @POST
    @Secured
    public Response reloadAptPackageLists() {
        return updateManager.reloadAptPackageLists();
    }

    @POST
    @Secured
    public Response executeDwhUpdate() {
        return updateManager.executeDwhUpdate();
    }
}
