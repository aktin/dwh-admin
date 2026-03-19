/**
 * Created by Xu on 31-May-17.
 */

export interface ImportStatusError {
    value: string,
    timestamp: Date,
    repeats: number,
    parsedError?: any,
}

export class ImportStatus {

    public static parseStr(str: string): ImportStatus {
        if (str) {
            return ImportStatus.parseObj(JSON.parse(str));
        } return null;
    }

    public static parseObj(obj: any): ImportStatus {
        return new ImportStatus(
            new Date(obj['start']),
            new Date(obj['lastWrite']),
            (obj['lastRejectTime']) ? new Date(obj['lastRejectTime']) : null,
            obj['importedCount'],
            obj['updatedCount'],
            obj['invalidCount'],
            obj['failedCount'],
            ImportStatus.parseError(obj['lastErrors']),
        );
    }

    public static parseError(objErr: any[]): ImportStatusError[] {
        return objErr?.reduce((array, obj) => {
            let error: any = {};
            obj['value']?.split('\n')?.forEach((msg: string) => {
                let ind = msg.indexOf(':');
                let head = msg.substring(0, ind);
                if (typeof error[head] === 'undefined') {
                    error[head] = [];
                }
                error[head].push(msg.substring(ind + 1).trim());
            });
            array?.push({
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
        public lastRejectTime: Date,
        public importedCount: number,
        public updatedCount: number,
        public invalidCount: number,
        public failedCount: number,
        public lastErrors: ImportStatusError[],
    ) {}
}
