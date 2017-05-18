import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Report } from '../reports/report';
/**
 * Created by Xu on 18.05.2017.
 */

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    transform(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

@Pipe({ name: 'successReports' })
export class SuccessReportsPipe implements PipeTransform {
    transform(reports: Report[], useFilter: boolean) {
        return useFilter ? reports.filter(report => report.isSuccess()) : reports;
    }
}
