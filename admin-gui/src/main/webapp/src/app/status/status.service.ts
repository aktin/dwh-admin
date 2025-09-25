/**
 * Created by Xu on 31-May-17.
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpService, StorageService, UrlService} from '../helpers/index';
import {ImportStatus} from './import-status';

interface StatsData {
  year: number;
  count: number;
  source: string;
}

@Injectable()
export class StatusService {

  private _dataInterval = 3000;

  constructor(
      private _http: HttpService,
      private _urls: UrlService,
      private _store: StorageService
  ) {}

  private _updateStatus (): void {
    // this._http.get(this._url.parse('status')).map(res => console.log(ImportStatus.parseObj(res.json()));).subscribe();
    this._http.get<ImportStatus>(this._urls.parse('status')).pipe(this._http.debounce(
        'status',
        ImportStatus.parseStr(this._store.getValue('status.import')),
        null,
        this._dataInterval))
    .subscribe(status => {
          if (status) {
            this._store.setValue('status.import', JSON.stringify(status));
          }
        }
    );
  }

  getImportStatus (): ImportStatus {
    this._updateStatus();
    return ImportStatus.parseStr(this._store.getValue('status.import'));
  }

  getStats(): Observable<StatsData[]> {
    return this._http.get<StatsData[]>(this._urls.parse('script/stats/p21'));
  }
}