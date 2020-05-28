/**
 * Created by Xu on 23.04.2019
 */
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import * as FileSaver from "file-saver";

@Injectable({
  providedIn: "root"
})
export class DownloadService {
  constructor(private _http: HttpClient) {}
  get(filename: string, type: string, url: string): void {
    let options = { headers: new HttpHeaders({ Accept: type }), responseType: "blob" as "json" };

    this._http.get<Blob>(url, options).subscribe(
      blob => FileSaver.saveAs(blob, filename),
      error => {
        console.log("Error downloading the file: ", error);
      }
    );
  }
}
