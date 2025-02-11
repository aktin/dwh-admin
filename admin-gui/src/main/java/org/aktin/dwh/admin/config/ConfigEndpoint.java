package org.aktin.dwh.admin.config;

import org.aktin.Preferences;
import org.aktin.dwh.admin.config.validator.ValidationRequest;
import org.aktin.dwh.prefs.impl.PropertyFilePreferences;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.Map;

@Path("config")
public class ConfigEndpoint {
    @Inject
    private Preferences pref;

    @Path("updateProperties")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
//    @Secured TODO check if secured is needed and what authentication would be required
    public ValidationRequest executePropertiesFileUpdate(ValidationRequest request) {
        ValidationRequest v = new ValidationRequest();
        Map<String, String> incorrect_preferences = new HashMap<>();
        ConfigUpdateService service = new ConfigUpdateService();
        PropertyFilePreferences p = service.getPreferences();

//        incorrect_preferences.put("rscript.debug", "false");
//        v.setPreferences(service.getPrefs(p));
        return v;
    }
}
