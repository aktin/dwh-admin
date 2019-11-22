import { Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { UrlService } from "@aktin/utils";
import { CaseStatus, Case } from "./models";

@Injectable({
  providedIn: "root",
})
export class CaseService {
  private baseURL = "";
  private _locale = "de-DE";
  constructor(private _url: UrlService) {
    this.baseURL = this._url.link(["REPORT"]);
  }

  updateCases(): Observable<Case[]> {
    console.log("hier in case service");
    return this._url.get<Case[]>(this._url.getUrl("report/archive")).pipe(
      map(reports => {
        return reports.map(
          (report, index): Case => {
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

  private _parseReport(report: Case) {
    report.timespan = [this._parseDate(report.start), this._parseDate(report.end)];
    report.generationDate = this._parseDate(report.data);

    report.state = CaseStatus[report.status];
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
  private getLink(report: Case, base: string): string {
    let url = null;
    if (report.state === CaseStatus.Completed) {
      url = base + "/" + report.id;
    }
    return url;
  }
  private genName(report: Case): string {
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
