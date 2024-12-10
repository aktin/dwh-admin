package org.aktin.dwh.admin.updater.validator;

public class ValidateNumber implements Validator {
    private char CODE = 'n';

    public boolean validate(String desc, String value) {
        if(desc.contains(""+this.CODE)) {
            try {
                Integer.parseInt(value);
                return true;
            } catch (NumberFormatException e) {
                return false;
            }
        } else {
            return true;
        }
    }

    public String getErrorMessage() {
        return "Nummer erwartet";
    }
}
