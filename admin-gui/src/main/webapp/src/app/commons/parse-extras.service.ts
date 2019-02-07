import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export interface Config {
  heroesUrl: string;
  textfile: string;
}

@Injectable({
  providedIn: "root"
})
export class ParseExtrasService {
  constructor(private http: HttpClient) {}
  configUrl = "assets/extras.json";

  getConfig() {
    return this.http.get(this.configUrl);
  }

  getPage() {
    return this.http.get("http://localhost:4400/extra2/");
    // return "<h3>some page with code </h3> <div style='background-color:black;color:beige;height: 50px; width: 100%;'>some more</div>";
  }
}
