import { Injectable } from "@angular/core";
import { APP_ROUTE_LINK } from "@app/app.routes.names";

@Injectable({
  providedIn: "root"
})
export class LinkerService {
  constructor() {}

  parse(routes: string[]) {
    return APP_ROUTE_LINK(routes);
  }
}
