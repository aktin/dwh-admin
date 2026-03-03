import {BaseModel} from '../../helpers';

export class EncounterPeriod extends BaseModel {
    public ide: string;
    public startDate: number;
    public endDate: number;

    constructor(obj?: any) {
        super(obj);

        if(obj!!) Object.assign(this, obj);
    }
}
