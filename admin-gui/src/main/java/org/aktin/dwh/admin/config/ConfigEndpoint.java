package org.aktin.dwh.admin.config;
import org.aktin.dwh.admin.config.validator.ValidationRequest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.io.IOException;

@Path("config")
public class ConfigEndpoint {

    @Path("updateProperties")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
//    @Consumes(MediaType.TEXT_PLAIN)
//    @Secured TODO check if secured is needed and what authentication would be required
    public String executePropertiesFileUpdate(ValidationRequest request) throws IOException, InterruptedException {
        ConfigUpdateService service = new ConfigUpdateService();
        String updateMessage = service.updatePreferences(request);
        return "{\"message\": \"" + updateMessage + "\"}";
    }
}
