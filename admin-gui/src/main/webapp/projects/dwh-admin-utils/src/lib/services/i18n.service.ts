import { Injectable } from "@angular/core";
import _ from "lodash";

@Injectable({
  providedIn: "root"
})
export class I18nService {
  private locale = "de";
  private data = { de: {} };
  constructor() {}

  addI18NData(locale: string, key: string, data: any) {
    if (!this.data[locale]) {
      this.data[locale] = { key: {} };
    }
    this.data[locale][key] = _.assign(this.data[locale][key], data);
  }

  setLocale(newLocale: string) {
    this.locale = newLocale;
  }

  hasKey(key: string): boolean {
    return !_.isEmpty(this.data[this.locale][key]);
  }

  parse(key: string, subkey: string): string {
    return String(this.getValue(key, subkey));
  }

  getValue(key: string, subkey: string) : any {
    let longKey = key + "." + subkey;
    if (!this.hasKey(key)) {
      return longKey;
    }
    return this.data[this.locale][key][subkey] || longKey;
  }
}
