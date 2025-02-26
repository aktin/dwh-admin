package org.aktin.dwh.admin.config;
import org.aktin.dwh.admin.config.validator.ValidationRequest;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

@Path("config")
public class ConfigEndpoint {

    @Path("status")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String isOnline() {
        return "{\"response\": \"online\"}";
    }

    @Path("updateProperties")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_JSON)
//    @Consumes(MediaType.TEXT_PLAIN)
//    @Secured TODO check if secured is needed and what authentication would be required
    public String executePropertiesFileUpdate(ValidationRequest request) throws IOException, InterruptedException, TimeoutException {
        ConfigUpdateService service = new ConfigUpdateService();
        String updateMessage = service.updatePreferences(request);
//        return "{\"message\": \"" + updateMessage + "\"}";
        return updateMessage;
    }
}
