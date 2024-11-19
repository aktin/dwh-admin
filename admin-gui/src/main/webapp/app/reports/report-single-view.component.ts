/**
 * Created by Xu on 15.05.2017.
 */
import { ViewChild, Component, Input } from '@angular/core';
import { Report, ReportStatus } from './report';
import { ReportService } from './report.service';
import { PopUpMessageComponent } from './../helpers/popup-message.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'report-single-view',
    templateUrl: './report-single-view.component.html',
    styleUrls: ['./reports.component.css'],
})

export class ReportSingleViewComponent  {
    @Input() reportData: Report;
    @Input() single = false;
    downloadLoading = false;

    @ViewChild(PopUpMessageComponent) popUpDeleteConfirm: PopUpMessageComponent;

    private subscription_delete: Subscription;

    constructor(private _reportService: ReportService, private _router: Router) {}

    get report (): Report {
        return this.reportData;
    }

    get reportClass () {
        return {
            'report-waiting'    : this.report.status === ReportStatus.Waiting,
            'report-success'    : this.report.status === ReportStatus.Completed,
            'report-failed'     : this.report.status !== ReportStatus.Completed,
        };
    }

    get endDate () {
        let next = new Date (this.reportData.timespan[1].getTime());
        next.setDate(this.reportData.timespan[1].getDate() - 1);
        return next;
    }

    downloadResult (): void {
        console.log(this.reportData);
        this.downloadLoading = true;
        this._reportService.downloadReportFile(this.reportData);
        setTimeout(() => {
            this.downloadLoading = false;
        }, 500);
    }

    deleteReport() {
        let button = ['icon trash', 'Löschen', 'red'];
        this.popUpDeleteConfirm.setConfirm(button);
        this.popUpDeleteConfirm.onTop = true;
        this.popUpDeleteConfirm.setData(true, 'Bericht löschen',
        'Wollen Sie diesen Bericht wirklich unwiderruflich löschen?',
            (submit: boolean) => {
                if (submit) {
                    this.subscription_delete = this._reportService.deleteReportFile(this.reportData.id)
                        .subscribe(event => {
                            this.subscription_delete.unsubscribe();
                            this._router.navigate(['/report']);
                        }, (error: any) => {
                            console.log(error);
                        });
                }
            }
        );
    }
}
