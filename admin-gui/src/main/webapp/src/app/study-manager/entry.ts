import {Participation} from "./participation";
import {Study} from "./study";
import {BaseModel} from "../helpers";
import {SICGeneration} from "./sic-generation";
import {PatientReference} from "./patient-reference";

export class Entry extends BaseModel {
  public comment: string = "";
  public i2b2PatientNumber: number;
  public participation: Participation;
  public idExt: string;
  public idRoot: string;
  public reference: PatientReference;
  public sic: string;
  public timestamp: number;
  public user: string;
  public study: Study;
  public participationString: string;

  constructor(obj?: any) {
    super(obj);
    Object.assign(this, obj);

    switch (this.participation) {
      case Participation.OptIn:
        this.participationString = 'Einschluss';
        break;
      case Participation.OptOut:
        this.participationString = 'Ausschluss';
        break;
    }
  }
}


