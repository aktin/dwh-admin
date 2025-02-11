package org.aktin.dwh.admin.config.validator;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import java.util.Map;

@XmlAccessorType(XmlAccessType.FIELD)
public class ValidationRequest {
    private Map<String, String> preferences;

    public Map<String, String> getPreferences() {
        return preferences;
    }

    public void setPreferences(Map<String, String> preferences) {
        this.preferences = preferences;
    }
}

