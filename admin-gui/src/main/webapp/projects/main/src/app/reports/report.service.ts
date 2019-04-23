import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { formatDate } from "@angular/common";
import { Observable, EMPTY } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Report, ReportStatus } from "./models";
// @ts-ignore
import { UrlService, I18nService } from "@aktin/utils";
// @ts-ignore
import i18DeData from "./i18n/de.json";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  private baseURL = "";

  constructor(
    @Inject(LOCALE_ID) private _locale: string,
    private _url: UrlService,
    private _i18n: I18nService,
  ) {
    this.baseURL = this._url.getUrl("report/archive"); // this._url.link(["REPORT"]);
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
      map((reports: Report[]) => {
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
    name += formatDate(report.timespan[0], " MMMM yyyy", this._locale);
    return name;
  }
}
