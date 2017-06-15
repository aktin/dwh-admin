/**
 * Created by Xu on 18.05.2017.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { Report, ReportStatus } from './report';

@Pipe({ name: 'success' })
export class SuccessReportsPipe implements PipeTransform {
    transform(reports: Report[], useFilter: boolean) {
        return useFilter ? reports.filter(report => report.isSuccess()) : reports;
    }
}
