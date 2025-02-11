package org.aktin.dwh.admin.config.validator;

public class ValidateBoolean implements Validator{
    private char CODE = 'b';
    private String value;

    /**
     *
     * @param desc : description of validation types required
     * @param value
     * @return  true - if desc does not contain {@value CODE} or value is True or False (no case sensitive)
     *          false - if desc contains {@value CODE} but value is not True or False
     */
    public boolean validate(String desc, String value) {
        this.value = value;
        return !(desc.contains("" + this.CODE) & !value.equalsIgnoreCase("true") & !value.equalsIgnoreCase("false"));
    }

    public String getErrorMessage() {
        return "\"true\" oder \"false\" erwartet, \""+this.value+"\" erhalten";
    }
}
