package org.aktin.dwh.admin.config;
import org.aktin.dwh.prefs.impl.PropertyFilePreferences;

import java.io.IOException;
import java.util.concurrent.TimeoutException;


public class ConfigUpdateService {
    private PropertyFilePreferences prefManager;
    private int timeout = 15000; //Timeout for starting Wildfly until resources are reachable

    public ConfigUpdateService() throws IOException {
        this.prefManager = new PropertyFilePreferences();
    }

    public String updatePreferences(ValidationRequest request) throws IOException, InterruptedException {
        // update preference file
        String updateMessage = this.prefManager.updatePropertiesFile(request.getPreferences());
        if (updateMessage.isEmpty()) {
            return "";
        } else {
            return "Properties config status:"+updateMessage;
        }
    }

    public String loadBackupFile() {
        return this.prefManager.loadBackupFile();
    }

}


