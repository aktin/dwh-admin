import { Injectable } from "@angular/core";
import { UrlService } from "@app/routing";

@Injectable({
  providedIn: "root"
})
export class LinkerService {
  constructor() {}

  parse(routes: string[]) {
    return UrlService.link(routes);
  }
}
