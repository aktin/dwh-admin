import { Injectable } from "@angular/core";
import { Url2Service } from "@app/routing";

@Injectable({
  providedIn: "root"
})
export class LinkerService {
  constructor() {}

  parse(routes: string[]) {
    return Url2Service.link(routes);
  }
}
