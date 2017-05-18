/**
 * Created by Xu on 03.05.2017.
 */
import { DateParser } from '../helpers/index';

export interface RawReport {
    id: number;
    data: string;
    start: string;
    end: string;
    template: string;
    type: string;
    status: string;
}

export class Report {

    public static parseReport (obj: RawReport, url?: string): Report {
        let report = new Report (
            obj.id,
            (obj.data) ? new Date(obj.data) : null,
            [new Date(obj.start), new Date(obj.end)],
            obj.template,
            obj.type,
            ReportStatus[obj.status],
        );
        report.getLink(url);
        report.genName();
        return report;
    }

    public static parseObj (obj: any): Report {
        let timespan = obj['timespan'] || [];
        return new Report(
            obj['id'],
            new Date(obj['generationDate']),
            [new Date(timespan[0]), new Date(timespan[1])],
            obj['template'],
            obj['type'],
            obj['status'],
            obj['url'],
            obj['name'],
            obj['filename'],
        );
    }

    constructor(
        public id: number,
        public generationDate: Date, // if not null: report generation date
        public timespan: [Date, Date],
        public template: string,
        public type: string,
        public status: ReportStatus,
        public url?: string,
        public name?: string,
        public filename ?: string,
    ) { }


    public getLink (base: string): string {
        if (this.status === ReportStatus.Completed) {
            this.url = base + '/' + this.id;
        }
        return this.url;
    }

    public genName (): string {
        this.name = '';
        this.filename = '';
        if (this.template === 'org.aktin.report.aktin.AktinMonthly') {
            this.name += 'AKTIN-Monatsbericht';
            this.filename += 'AKTIN-Monatsbericht';
        } else {
            this.name += this.template;
            this.filename += this.template;
        }
        this.name += ' ' + DateParser.getMonth(this.timespan[0].getMonth()) + ' ' + this.timespan[0].getFullYear();
        this.filename += '-' + DateParser.getMonth(this.timespan[0].getMonth()) + '-' + this.timespan[0].getFullYear() + '.pdf';
        return this.name;
    }
    public getDeStatus (): string {
        return ReportStateParse[this.status];
    }
    public isSuccess (): boolean {
        return this.status === ReportStatus.Completed;
    }
}

export enum ReportStatus {
    'Completed',
    'InsufficientData',
    'Waiting',
}

/**
 * TODO find some better and prettier way
 */
export enum ReportStateParse {
    'Erfolg',
    'Datenfehler',
    'wird erstellt',
}
