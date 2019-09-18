import { Injectable } from "@angular/core";
// @ts-ignore
import { UrlService } from "@aktin/utils";

@Injectable({
  providedIn: "root",
})
export class ReportUrlService {
  constructor(private _url: UrlService) {}

  reportUrls = {
    reportsList: "report/archive",
    newMonthlyReport: "report/monthly/email",
    reportTemplates: "report/template", // get
    newReport: "report/template/@templateId@", // post, with start and end in data, json in header
  };

  parse(url: string, args?: any): string {
    return this._url.parse(url, args, this.reportUrls);
  }

  get<T>(url: string, args?: any) {
    return this._url.get<T>(this.parse(url, args));
  }
}
