/**
 * Created by Wiliam Hoy on 14.01.2025.
 * Property service
 */
import {ElementRef, Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, Validators} from "@angular/forms";
import {HttpInterceptorService, UrlService} from "../helpers";
import {Subscription} from "rxjs";
import {Observable} from "rxjs/Observable";
import {Response} from "@angular/http";


/**
 * Service Class for input validation
 */
@Injectable()
export class PreferenceEditService {
    private regex_name   = "^[A-Za-z\\.]+([\\s|-][A-Za-z\\.]*)*$";
    private regex_number = "^[0-9]+$";
    private regex_url    = "^([htps\\:\\/]*)?(.*(\\.[a-z]{2,3})|(localhost))";
    private regex_email  = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";  // match emails containing alphanumerical characters and '-' and '_'
    private regex_path   = "^(\\/$)|(([\\/][\\w-]+)+[\\/]?$)";   // match empty urls "/" and urls containing only alphanumerical characters and '-' and '_'
    private regex_boolean = "^(true|false)$\\i"

    private names = ["local.l", "local.ou", "local.cn", "local.o", "local.c", "local.s", ]
    private bools = ["rscript.debug", "mail.smtp.starttls.enable", "mail.smtp.auth", "report.debug.keeptempfiles"]
    private numbers = ["rscript.timeout", "import.script.timeout", "mail.smtp.timeout", "mail.smtp.port"]
    private urls = ["rscript.binary", "local.server.url", "wildfly.management.url", "mail.smtp.host", "i2b2.service.pm", "broker.uris"]
    private emails= ["local.email", "mail.x.replyto"]
    private paths = ["import.script.path", "import.cda.debug.dir", "import.data.path", "update.data.path", "broker.data.path", "broker.archive.path", "report.data.path", "report.temp.path", "report.archive.path"]
    private validation_spaces = {}
    private _dataInterval: 3000;

    constructor() {
        this.validation_spaces["paths"] = this.paths
        this.validation_spaces["urls"] = this.urls
        this.validation_spaces["emails"] = this.emails
        this.validation_spaces["numbers"] = this.numbers
        this.validation_spaces["bools"] = this.bools
    }

    /**
     * Searches all input fields and generates a JSON with preference names and new values
     * @param document
     * @param class_name
     */
    scrapPreferenceTable(document: ElementRef, class_name: String) {
        let prefs_json = {preferences:{}}
        let preference_list = document.nativeElement.querySelectorAll(`[class="${class_name}"]`)
        Array.from(preference_list).forEach((pref: HTMLInputElement) => {
            let id = this.escapeJSON(pref.getAttribute('id'));
            let value = this.escapeJSON(pref.value);
            if (id) {
                prefs_json.preferences[id] = value;
            }
        });
        return prefs_json
    }

    escapeJSON(jsonString: String) {
        return jsonString
            .replace(/\\/g, "\\\\")  // Escape backslashes
            .replace(/"/g, '\\"')    // Escape double quotes
            .replace(/\n/g, "\\n")   // Escape newlines
            .replace(/\r/g, "\\r")   // Escape carriage returns
            .replace(/\t/g, "\\t");  // Escape tabs
    }

    navigateToPreferencePage(router: Router): void {
        router.navigate(['/preferences'])
    }

    setCookie(name: string, value: string) {
        document.cookie = name + "=" + (value || "") + "; path=/; SameSite=Lax;";
    }

    getCookie(name: string) {
        let result = "";
        let cookies = document.cookie.split(';');
        cookies.forEach(function (cookie) {
            if (cookie.includes(name))
                result = cookie.split('=')[1]
        });
        return result;
    }

    deleteCookie(name: string) {
        document.cookie = name + '=; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    isValid(property_name: String, value: String) {
        let validator = null;
        console.log("validate: ",property_name, "props: ", this.numbers, " contains ", this.validation_spaces["numbers"].includes(property_name))
        switch (true) {
            case this.validation_spaces["urls"].includes(property_name):
                validator = Validators.pattern(this.regex_url);
                break;

            case this.validation_spaces["paths"].includes(property_name):
                validator = Validators.pattern(this.regex_path);
                break;

            case this.validation_spaces["numbers"].includes(property_name):
                console.log("check number: ",value," for property: ",property_name," insider array: ",this.numbers)
                validator = Validators.pattern(this.regex_number);
                break;

            case this.validation_spaces["bools"].includes(property_name):
                validator = Validators.pattern(this.regex_boolean);
                break;

            case this.validation_spaces["emails"].includes(property_name):
                validator = Validators.email;
                break;
            default:
                //TODO
                break;
        }
        return new FormControl(value, validator)    // validate value with regex
    }

}