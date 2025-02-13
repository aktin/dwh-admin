package org.aktin.dwh.admin.config;
import com.fasterxml.jackson.databind.annotation.JsonAppend;
import org.aktin.dwh.admin.config.validator.ValidationRequest;
import org.aktin.dwh.optinout.PatientReference;
import org.aktin.dwh.prefs.impl.PropertyFilePreferences;

import java.io.IOException;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;



public class ConfigUpdateService {
    private PropertyFilePreferences prefManager;

    public ConfigUpdateService() throws IOException {
        this.prefManager = new PropertyFilePreferences();
    }

    public String updatePreferences(ValidationRequest request) throws IOException, InterruptedException {
        Process stop = Runtime.getRuntime().exec("service wildfly stop");
        int exitCodeStop = stop.waitFor();
        String returnMessage = this.prefManager.updatePropertiesFile(request.getPreferences());
        Process start = Runtime.getRuntime().exec("service wildfly start");
        int exitCodeStart = start.waitFor();
        return "Server status codes:\\n\\tWildfly stopped:"+exitCodeStop+"\\n\\tWildfly started:"+exitCodeStart+"\\nProperties config errors:"+returnMessage;
    }

    public Map<String, String> getPrefs(PropertyFilePreferences pref) {
        String root;
        switch(PatientReference.valueOf(pref.get("study.id.reference"))) {
            case Patient:
                root = pref.get("cda.patient.root.preset");
                break;
            case Encounter:
                root = pref.get("cda.encounter.root.preset");
                break;
            case Billing:
                root = pref.get("cda.billing.root.preset");
                break;
            default:
                throw new IllegalArgumentException("Empty string as reference type is not allowed.");
        }
        Map<String, String> b = new HashMap<>();
        b.put("reference", pref.get("study.id.reference"));
        b.put("root", root);
        b.put("separator", pref.get("study.id.separator"));
        b.put("labelPatient", pref.get("study.id.patient.label"));
        b.put("labelEncounter", pref.get("study.id.encounter.label"));
        b.put("labelBilling", pref.get("study.id.billing.label"));
        return b;
    }


    private void overwritePreferencesFile(Map<String, String> prefs_new) {

    }

}


