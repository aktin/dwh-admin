package org.aktin.dwh.admin.updater;


import org.aktin.dwh.admin.updater.validator.ValidateBoolean;
import org.aktin.dwh.admin.updater.validator.ValidateNumber;
import org.aktin.dwh.admin.updater.validator.ValidatePath;
import org.aktin.dwh.admin.updater.validator.Validator;

import java.util.ArrayList;

public class PreferencesUpdateService {
    private ArrayList<Validator> validators = new ArrayList<Validator>();

    public PreferencesUpdateService() {
        this.initValidators();
    }

    private void initValidators() {
        this.validators.add( new ValidateNumber() );
        this.validators.add( new ValidateBoolean() );
        this.validators.add( new ValidatePath() );
    }

    public void validateInputs(String desc, String value) {
        for (Validator v: validators){
            if (!v.validate(desc, value)) {
                v.getErrorMessage();
            }
        }
    }


}


