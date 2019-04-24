import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { formatDate } from "@angular/common";
import { Observable, EMPTY } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Report, ReportStatus } from "./models";
// @ts-ignore
import { UrlService, I18nService, DownloadService } from "@aktin/utils";
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
    private _downloader: DownloadService,
  ) {
    this.baseURL = this._url.getUrl("report/archive"); // this._url.link(["REPORT"]);
    if (!this._i18n.hasKey("report")) {
      this._i18n.addI18NData("de", "report", i18DeData);
    }
  }

  parse(key): string {
    return this._i18n.parse("report", key);
  }

  download(report: Report): void {
    this._downloader.get(report.name, "application/pdf", report.url);
  }

  updateReports(): Observable<Report[]> {
    return this._url.get<Report[]>("report/archive").pipe(
      map((reports: Report[]) => {
        return reports.map(
          (report, index): Report => {
            let betterReport = this._parseReport(report);
            return betterReport;
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
  getUrl(report: Report): string {
    return this.getLink(report, this.baseURL);
  }
  private getLink(report: Report, base: string): string {
    return base + "/" + report.id;
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
