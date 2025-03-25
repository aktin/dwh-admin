package org.aktin.dwh.admin.config;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

/**
 * Data warehouse configuration endpoint. Manages updating aktin.properties
 */
@Path("config")
public class ConfigEndpoint {

    @Path("updateProperties")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_JSON)
    public String executePropertiesFileUpdate(ValidationRequest request) throws IOException, InterruptedException, TimeoutException {
        ConfigUpdateService service = new ConfigUpdateService();
        return service.updatePreferences(request);
    }

    @Path("rollbackProperties")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_JSON)
    public String restoreOldPropertiesFromBackup(ValidationRequest request) throws IOException {
        ConfigUpdateService service = new ConfigUpdateService();
        return service.loadBackupFile();
    }

}
