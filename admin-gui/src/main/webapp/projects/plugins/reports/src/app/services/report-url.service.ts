import { Injectable } from "@angular/core";
// @ts-ignore
import { UrlService } from "@aktin/utils";

@Injectable({
  providedIn: "root",
})
export class ReportUrlService extends UrlService {

  reportUrls = {
    reportsList: "report/archive",
    newMonthlyReport: "report/monthly/email",
    reportTemplates: "report/template", // get
    newReport: "report/template/@templateId@", // post, with start and end in data, json in header
  };

  parse(url: string, args?: any): string {
    return super.parse(url, args, this.reportUrls);
  }

  get<T>(url: string, args?: any) {
    return super.get<T>(this.parse(url, args));
  }
}
