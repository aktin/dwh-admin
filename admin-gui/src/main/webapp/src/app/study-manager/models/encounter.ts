import {BaseModel} from '../../helpers';

export class Encounter extends BaseModel {
    public idEnc: string;
    public startDate: number;
    public endDate: number;

    constructor(obj?: any) {
        super(obj);

        if(obj!!) Object.assign(this, obj);
    }
}
