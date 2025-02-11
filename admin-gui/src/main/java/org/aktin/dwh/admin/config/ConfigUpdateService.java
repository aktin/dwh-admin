package org.aktin.dwh.admin.config;
import org.aktin.dwh.optinout.PatientReference;
import org.aktin.dwh.prefs.impl.PropertyFilePreferences;

import java.io.IOException;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;



public class ConfigUpdateService {

    /**
     * Lets the PropertyFilePreferences class load the current preferences and returns them
     * @return Wrapper for preferences
     */
    public PropertyFilePreferences getPreferences() {
        try {
            PropertyFilePreferences propPref = new PropertyFilePreferences();
            return propPref;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
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


