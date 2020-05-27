import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { formatDate } from "@angular/common";
import {Observable, EMPTY, of} from "rxjs";
import { catchError, map } from "rxjs/operators";
import {Report, ReportStatus, ReportTemplate} from "../models";
import { ReportUrlService } from "./report-url.service";
// @ts-ignore
import { I18nService, DownloadService } from "@aktin/utils";
// @ts-ignore
import i18DeData from "../i18n/de.json";

@Injectable({
    providedIn: "root",
})
export class ReportService {
    private baseURL = "";
    
    constructor(
        @Inject(LOCALE_ID) private _locale: string,
        private _url: ReportUrlService,
        private _i18n: I18nService,
        private _downloader: DownloadService,
    ) {
        this.baseURL = this._url.parse("reportsList"); // this._url.link(["REPORT"]);
        if (!this._i18n.hasKey("report")) {
            this._i18n.addI18NData("de", "report", i18DeData);
        }
    }
    
    parse(key): string {
        return this._i18n.parse("report", key);
    }
    
    getValue(key) : any {
        return this._i18n.getValue("report", key);
    }
    
    download(report: Report): void {
        this._downloader.get(report.name, "application/pdf", report.url);
    }
    
    updateReports(): Observable<Report[]> {
        let reportPipe = this._url.get<Report[]>("reportsList").pipe(
            // @ts-ignore
            map((reports: Report[]) => {
                return  reports.map(
                    (report, index): Report => {
                        let betterReport = this._parseReport(report);
                        // console.log("b, ", index, betterReport );
                        return betterReport;
                    },
                );
            }),
            catchError(error => {
                console.log("ERROR", error);
                return of([]);
            }),
        );
        
        return reportPipe;
    }
    
    updateTemplates(): Observable<ReportTemplate[]> {
        
        let templatePipe = this._url.get<ReportTemplate[]>("reportTemplates").pipe(
            // @ts-ignore
            map((templates: ReportTemplate[]) => {
                return  templates
            }),
            catchError(error => {
                console.log("ERROR", error);
                return of([]);
            }),
        );
        
        return templatePipe;
    }
    
    private _parseReport(report: Report) {
        if (report) {
            report.timespan = [this._parseDate(report.start), this._parseDate(report.end)];
            report.generationDate = this._parseDate(report.data);
            
            report.state = ReportStatus[report.status];
            report.name = this.genName(report);
            report.url = this.getLink(report, this.baseURL);
        }
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
