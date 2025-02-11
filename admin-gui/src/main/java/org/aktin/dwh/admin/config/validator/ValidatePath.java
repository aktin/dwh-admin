package org.aktin.dwh.admin.config.validator;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;

public class ValidatePath implements Validator{
    private char CODE = 'p';

    public boolean validate(String desc, String value) {
        if(desc.contains(""+this.CODE)) {
            try {
                File f = new File(value);
                FileReader fr = new FileReader(f);
                return true;
            } catch (FileNotFoundException e) {
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
