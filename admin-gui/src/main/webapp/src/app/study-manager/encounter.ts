import {BaseModel} from '../helpers';

export class Encounter extends BaseModel {
    public encounterId: number;
    public patientId: number;
    public startDate: number;
    public endDate: number;

    constructor(obj?: any) {
        super(obj);

        if(obj!!) Object.assign(this, obj);
    }
}
