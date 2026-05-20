/**
 * Created by Xu on 31-May-17.
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService, UrlService} from '../helpers/index';
import {ImportStatus} from './import-status';
import {map} from 'rxjs/operators';

interface StatsData {
  year: number;
  count: number;
  source: string;
}

@Injectable()
export class StatusService {
  constructor(
      private _http: HttpService,
      private _urls: UrlService,
  ) {
  }

  getImportStatus(): Observable<ImportStatus> {
    return this._http.get(this._urls.parse('status'), {headers: {Accept: 'application/xml'}, responseType: "text"})
        .pipe(map(res => ImportStatus.parseXml(res)));
  }

  getStats(): Observable<StatsData[]> {
    return this._http.get<StatsData[]>(this._urls.parse('script/stats/p21'));
  }
}