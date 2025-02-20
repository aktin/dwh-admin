/**
 * Created by Xu on 03.05.2017.
 */

export class Visit {
    public static parseObj (obj: any): Visit {
        Object.setPrototypeOf(obj, Visit.prototype);
        return obj;
    }

    constructor(
        public root: string,
        public encounterId: string,
        public xml: string = null,
    ) { }
}
