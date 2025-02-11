/**
 * Created by Wiliam Hoy on 14.01.2025.
 * Property service
 */
import {ElementRef, Injectable} from '@angular/core';
import {PreferencesEditComponent} from "./preferencesEdit.component";

/**
 * Service Class for input validation
 */
@Injectable()
export class PreferenceEditService {
    public regex_name   = "^[A-Za-z\\.]+([\\s][A-Za-z\\.]*)*";
    public regex_number = "^[0-9]+";
    public regex_url    = "^([htps\\:\\/]*)?[0-9]{1,3}([.][0-9]{1,3}){3}[.]*";
    public regex_email  = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";  // match emails containing alphanumerical characters and '-' and '_'
    public regex_path   = "^(\\/$)|(([\\/][\\w-]+)+[\\/]?$)";   // match empty urls "/" and urls containing only alphanumerical characters and '-' and '_'
    public regex_boolean = "^(true|false)$\\i"

    /**
     * Searches all input fields and generates a JSON with preference names and new values
     * @param document
     * @param class_name
     */
    scrapPreferenceTable(document: ElementRef, class_name: String) {
        let prefs_json = {}
        let preference_list = document.nativeElement.querySelector(`[class="${class_name}"]`)
        Array.from(preference_list).forEach((pref: HTMLInputElement) => {
            let id = pref.getAttribute('id');
            let value = pref.value;
            if (id) {
                prefs_json[id] = value;
            }
        });
        return prefs_json
    }

    validateInput(value: String, property_name: String) {

    }

    getValidationTypeForProperty(property_name: String) {

    }
}