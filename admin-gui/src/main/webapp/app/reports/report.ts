/**
 * Created by Xu on 03.05.2017.
 */
export interface ReportTemplate {
    id: string;
    version: string;
    description: string;
}

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
    private static _locale = 'de-DE';
    private static parseDate (date: string) {
        if (date) {
            return new Date(date);
        } return null;
    }
    private static getLink (obj: any, base: string): string {
        let url = null;
        if (obj['status'] === ReportStatus.Completed) {
            url = base + '/' + obj['id'];
        }
        return url;
    }
    private static genName (obj: any): string {
        let name = '';
        if (obj['template'] === 'org.aktin.report.aktin.AktinMonthly') {
            name += 'AKTIN-Monatsbericht';
        } else {
            name += obj['template'];
        }
        name += ' ' + obj['timespan'][0].toLocaleDateString(this._locale, {month: 'long'}) + ' ' + obj['timespan'][0].getFullYear();
        return name;
    }

    public static parseObj (obj: any, url?: string): Report {
        obj['timespan'] = obj['timespan'] || [];

        if (obj.hasOwnProperty('created')) {
            obj['created'] = this.parseDate(obj['created']);
        }
        if (obj.hasOwnProperty('data')) {
            obj['generationDate'] = this.parseDate(obj['data']);
        } else {
            obj['generationDate'] = this.parseDate(obj['generationDate']);
        }
        if (obj.hasOwnProperty('start') && obj.hasOwnProperty('end')) {
            obj['timespan'] = [this.parseDate(obj['start']), this.parseDate(obj['end'])];
        } else {
            obj['timespan'] = obj['timespan'] || [];
            obj['timespan'] = [this.parseDate(obj['timespan'][0]), this.parseDate(obj['timespan'][1])];
        }
        if (obj['status'] && obj['status'].length > 0) {
            obj['status'] = ReportStatus[obj['status']];
        }
        if (! obj['url']) {
            obj['url'] = this.getLink(obj, url);
        }
        if (! obj['name']) {
            obj['name'] = this.genName(obj);
        }
        Object.setPrototypeOf(obj, Report.prototype);
        return obj;
    }

    constructor(
        public id: number,
        public created: Date,
        public generationDate: Date, // if not null: report generation date
        public timespan: [Date, Date],
        public template: string,
        public type: string,
        public status: ReportStatus,
        public url?: string,
        public name?: string,
    ) { }

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
    'Timeout',
    'Failed',
}

/**
 * TODO find some better and prettier way
 */
export enum ReportStateParse {
    'Erfolg',
    'nicht ausreichend Daten vorhanden',
    'wird erstellt',
    'Zeitüberschreitung',
    'Fehler bei der Erstellung'
}
