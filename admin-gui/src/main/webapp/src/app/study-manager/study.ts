import {BaseModel} from "../helpers";
import {SICGeneration} from './sic-generation';

export class Study extends BaseModel {
  public id: string;
  public title: string;
  public description: string;
  public createdTimestamp: number;
  public closedTimestamp: number;
  public sicGeneration: SICGeneration;
  public sicGenerator: string;
  public sicGeneratorState: string;
  public optIn: boolean;
  public optOut: boolean;

  constructor(obj?: any) {
    super(obj);
    Object.assign(this, obj);
  }
}

export const compareStudies: (a: Study, b: Study) => boolean = (a: Study, b: Study) => !!a && !!b && a?.id === b?.id;
