/**
 * Created by Xu on 18.05.2017.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { Report } from '../../reports/index';

@Pipe({ name: 'successReports' })
export class SuccessReportsPipe implements PipeTransform {
    transform(reports: Report[], useFilter: boolean) {
        return useFilter ? reports.filter(report => report.isSuccess()) : reports;
    }
}
