/**
 * Created by Xu on 31-May-17.
 */

import _ = require('underscore');

export interface ImportStatusError {
    value: string,
    timestamp: Date,
    repeats: number,
    parsedError?: any,
}

export class ImportStatus {

    public static parseStr(str: string): ImportStatus {
        return ImportStatus.parseObj(JSON.parse(str));
    }

    public static parseObj(obj: any): ImportStatus {
        return new ImportStatus(
            new Date(obj['start']),
            new Date(obj['last-write']),
            (obj['last-reject']) ? new Date(obj['last-reject']) : null,
            obj['imported'],
            obj['updated'],
            obj['invalid'],
            obj['failed'],
            ImportStatus.parseError(obj['error']),
        );
    }

    public static parseError(objErr: any[]): ImportStatusError[] {
        return _.reduce(objErr, (array, obj) => {
            let error = {};
            _.each(obj['value'].split('\n'), (msg: string) => {
                let ind = msg.indexOf(':');
                let head = msg.substring(0, ind);
                if (typeof error[head] === 'undefined') {
                    error[head] = [];
                }
                error[head].push(msg.substring(ind + 1).trim());
            });
            array.push({
                value : obj['value'],
                    timestamp : new Date(obj['timestamp']),
                repeats : obj['repeats'] || 1,
                parsedError : error,
            });
            return array;
        }, []);
    }

    constructor(
        public start: Date,
        public lastWrite: Date,
        public lastReject: Date,
        public imported: number,
        public updated: number,
        public invalid: number,
        public failed: number,
        public error: ImportStatusError[],
    ) {}
}
