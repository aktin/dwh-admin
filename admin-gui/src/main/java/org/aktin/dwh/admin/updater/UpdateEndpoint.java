package org.aktin.dwh.admin.updater;

import org.aktin.dwh.admin.auth.Secured;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;
import java.util.Map;
import java.util.Properties;

@Path("update")
public class UpdateEndpoint {

    @Inject
    UpdateManager updateManager;

    @Context
    private SecurityContext security;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public boolean isNewDwhUpdateAvailable() {
        return updateManager.isNewDwhUpdateAvailable();
    }

    @Path("info")
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
    public boolean wasDwhUpdateSuccessful() {
        return updateManager.wasDwhUpdateSuccessful();
    }

    @Path("apt/reload")
    @POST
    @Secured
    public void reloadAptPackageLists() {
        updateManager.reloadAptPackageLists();
    }

    @POST
    @Secured
    public void executeDwhUpdate() {
        updateManager.executeDwhUpdate();
    }

}