package org.aktin.dwh.admin.updater.validator;

import java.io.File;
import java.io.FileNotFoundException;

public class ValidatePath implements Validator{
    private char CODE = 'p';

    public boolean validate(String desc, String value) {
        if(desc.contains(""+this.CODE)) {
            try {
                new File(value);
                return true;
            } catch (NullPointerException e) {
                return false;
            }
        } else {
            return true;
        }
    }

    public String getErrorMessage() {
        return "es wurde keine Datei unter diesem Pfad gefunden";
    }
}
