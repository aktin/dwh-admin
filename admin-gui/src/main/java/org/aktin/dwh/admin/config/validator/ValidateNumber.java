package org.aktin.dwh.admin.config.validator;

public class ValidateNumber implements Validator {
    private char CODE = 'n';
    private String value;

    public boolean validate(String desc, String value) {
        if(desc.contains(""+this.CODE)) {
            this.value = value;
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
        return "Nummer erwartet, \""+this.value+"\" erhalten";
    }
}
