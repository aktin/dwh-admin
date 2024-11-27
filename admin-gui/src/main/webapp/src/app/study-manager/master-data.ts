import {BaseModel} from '../helpers';

export class MasterData extends BaseModel {
    public birthDate: number;
    public sex: string;
    public zip: any;
    public patientId: number;

    constructor(obj?: any) {
        super(obj);

        if(obj!!) Object.assign(this, obj);
    }
}
