package org.aktin.dwh.admin.config;
import org.aktin.dwh.prefs.impl.PropertyFilePreferences;

import java.io.IOException;
import java.nio.file.Paths;


public class ConfigUpdateService {
    private PropertyFilePreferences prefManager;

    public ConfigUpdateService() throws IOException {
        this.prefManager = new PropertyFilePreferences();
    }

    public String updatePreferences(ValidationRequest request) throws IOException {
        // update preference file
        String updateMessage = this.prefManager.updatePropertiesFile(request.getPreferences());
        if (updateMessage.isEmpty()) {
            return "";
        } else {
            return "Properties config status:"+updateMessage;
        }
    }

    public void loadBackupFile() throws IOException {
        this.prefManager.loadBackupFile();
    }

    public void loadBackupFile(String path) throws IOException {
        this.prefManager.loadBackupFile(Paths.get(path));
    }

}


