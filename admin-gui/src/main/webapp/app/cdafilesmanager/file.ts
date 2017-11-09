/**
 * Created by Xu on 03.05.2017.
 */

export class CDAFile {
    public static parseObj (obj: any): CDAFile {
        Object.setPrototypeOf(obj, CDAFile.prototype);
        return obj;
    }

    constructor(
        public id: number,
        public patId: number,
    ) { }
}
