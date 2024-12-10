package org.aktin.dwh.admin.updater.validator;

public interface Validator {
    char CODE = '*';
    /***
     * Implements a framework for validating given variables. Gets a list of validation factors from {@value desc}
     * and checks if a individual implementation of this method is needed.
     * @param desc : description of validation types required
     * @param value
     * @return boolean if the value is valid for each of the validation requirements
     */
    boolean validate(String desc, String value);

    String getErrorMessage();
}

