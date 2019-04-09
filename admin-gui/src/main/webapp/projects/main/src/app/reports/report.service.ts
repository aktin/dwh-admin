import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { Observable, EMPTY } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { UrlService } from "@aktin/utils";
import { Report, ReportStatus } from "./models";
import i18DeData from "./i18n/de.json";
import { I18nService } from "./i18n/i18n.service";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  private baseURL = "";
  @Inject(LOCALE_ID) private _locale: string;
  constructor(private _url: UrlService, private _i18n: I18nService) {
    this.baseURL = this._url.link(["REPORT"]);
    console.log(this._locale);
    if (!this._i18n.hasKey("report")) {
      this._i18n.addI18NData("de", "report", i18DeData);
    }
  }

  parse(key): string {
    return this._i18n.parse("report", key);
  }

  updateReports(): Observable<Report[]> {
    console.log("hier in service");
    return this._url.get<Report[]>("report/archive").pipe(
      map(reports => {
        return reports.map(
          (report, index): Report => {
            return this._parseReport(report);
          },
        );
      }),
      catchError(error => {
        console.log("ERROR", error);
        return EMPTY;
      }),
    );
  }

  private _parseReport(report: Report) {
    report.timespan = [this._parseDate(report.start), this._parseDate(report.end)];
    report.generationDate = this._parseDate(report.data);

    report.state = ReportStatus[report.status];
    report.name = this.genName(report);
    report.url = this.getLink(report, this.baseURL);
    return report;
  }
  private _parseDate(date: string) {
    if (date) {
      return new Date(date);
    }
    return null;
  }
  private getLink(report: Report, base: string): string {
    let url = null;
    if (report.state === ReportStatus.Completed) {
      url = base + "/" + report.id;
    }
    return url;
  }
  private genName(report: Report): string {
    let name = "";
    if (report.template === "org.aktin.report.aktin.AktinMonthly") {
      name += "AKTIN-Monatsbericht";
    } else {
      name += report.template;
    }
    name +=
      " " +
      report.timespan[0].toLocaleDateString(this._locale, { month: "long" }) +
      " " +
      report.timespan[0].getFullYear();
    return name;
  }
}
