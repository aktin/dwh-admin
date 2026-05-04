/**
 * Created by Xu on 31-May-17.
 */

export interface ImportStatusError {
    timestamp: Date,
    repeats: number,
    parsedError?: any,
}

interface XmlResponse {
    start: string,
    'last-write': string,
    'last-reject': string,
    imported: number,
    updated: number,
    invalid: number,
    failed: number,
    'last-errors': any[],
}



export class ImportStatus {
    public static parseXml(xml: string): ImportStatus {
        const root = new DOMParser().parseFromString(xml, "application/xml")?.documentElement;

        const text = (selector: string): string => root.querySelector(selector)?.textContent || '';
        const number = (selector: string): number => parseInt(text(selector), 10) || 0;

        const obj: XmlResponse = {
            start: text('start'),
            'last-write': text('last-write'),
            'last-reject': text('last-reject'),
            imported: number('imported'),
            updated: number('updated'),
            invalid: number('invalid'),
            failed: number('failed'),
            'last-errors': this.parseErrorXmls(root.querySelectorAll('last-errors > *'))
        };

        return new ImportStatus(
            new Date(obj['start']),
            !!obj['last-write'] ? new Date(obj['last-write']) : null,
            !!obj['last-reject'] ? new Date(obj['last-reject']) : null,
            obj['imported'],
            obj['updated'],
            obj['invalid'],
            obj['failed'],
            obj['last-errors'],
        );
    }

    private static parseErrorXmls(objErr: NodeListOf<Element>): ImportStatusError[] {
        return Array.from(objErr)?.map((obj) => ({
            timestamp: new Date(obj.getAttribute("timestamp")),
            repeats: !obj.getAttribute("repeats") ? 1 : +obj.getAttribute("repeats"),
            parsedError: obj.textContent,
        }));
    }

    constructor(
        public start: Date,
        public lastWrite: Date,
        public lastReject: Date,
        public imported: number,
        public updated: number,
        public invalid: number,
        public failed: number,
        public errors: ImportStatusError[],
    ) {
    }
}