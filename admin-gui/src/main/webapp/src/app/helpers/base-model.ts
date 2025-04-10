export class BaseModel {
  constructor(obj?: any) {
    if (!!obj) {
      Object.assign(this, obj);
    }
  }
}
