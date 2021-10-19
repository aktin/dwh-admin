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
import java.util.Properties;

@Path("update")
public class UpdateEndpoint {

    @Inject
    UpdateManager updateManager;

    @Context
    private SecurityContext security;

    @Path("agent")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public boolean isUpdateAgentInstalled() {
        return updateManager.isUpdateAgentInstalled();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Properties getDwhUpdateInfoContent() {
        return updateManager.getDwhUpdateInfo();
    }

    @Path("log")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getDwhUpdateLog() {
        return updateManager.getDwhUpdateLog();
    }

    @Path("success")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Boolean wasDwhUpdateSuccessful() {
        return updateManager.wasDwhUpdateSuccessful();
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