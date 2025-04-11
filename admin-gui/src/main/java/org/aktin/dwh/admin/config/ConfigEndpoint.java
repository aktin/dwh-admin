package org.aktin.dwh.admin.config;

import javax.json.JsonObject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.Arrays;

/**
 * Data warehouse configuration endpoint. Manages updating aktin.properties
 */
@Path("config")
public class ConfigEndpoint {

    @Path("updateProperties")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_JSON)
    public String executePropertiesFileUpdate(ValidationRequest request) throws IOException {
        ConfigUpdateService service = new ConfigUpdateService();
        return service.updatePreferences(request);
    }

    @Path("backups")
    @GET
    public Response getBackupFiles() throws IOException {
        ConfigUpdateService service = new ConfigUpdateService();
        String[] backups = service.getBackups();
        return Response.ok(backups).build();
    }

    @Path("rollbackProperties")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response restoreLastPropertiesFromBackup() throws IOException {
        ConfigUpdateService service = new ConfigUpdateService();
        service.loadBackupFile();
        return Response.ok("{\"message\": \"Backup restored successfully\"}").build();
    }

    @Path("rollbackVersionedProperties")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.TEXT_PLAIN)
    public Response restoreSpecificPropertiesFromBackup(String path) throws IOException {
        ConfigUpdateService service = new ConfigUpdateService();
        service.loadBackupFile(path);
        return Response.ok("{\"message\": \"Backup restored successfully\"}").build();
    }

}
