/**
 * Created by Xu on 06.11.2017.
 *
 * Files Service
 */
import { Injectable }   from '@angular/core';
import { Response }     from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import _ = require('underscore');

import { StorageService, UrlService, HttpInterceptorService, DownloadService } from '../helpers/index';
import { Visit } from './visit';

@Injectable()
export class VisitService {

    private _dataInterval = 3000;
    private _storedDataName = 'visits';

    constructor(
        private _http: HttpInterceptorService,
        private _urls: UrlService,
        private _store: StorageService,
        private _download: DownloadService
    ) {}

    private _updateVisit (root: string, encounterId: string, index = -1, visit: Visit = null): void {
        this._http.debouncedGet<Visit> (
            this._storedDataName + '.' + root + '.' + encounterId,
            visit, null,
            this._dataInterval,
            this._urls.parse('visit', {root: root, id: encounterId}),
            (res: Response) => {
                if (!visit) {
                    visit = new Visit(root, encounterId);
                }
                visit.xml = res.text();
                return visit;
            }, (err: Response) => {
                return err;
            }
        ).subscribe(
            v => {
                if (v) {

                    let visits = JSON.parse(this._store.getValue(this._storedDataName + '.data'));
                    if (!visits) {
                        visits = [];
                    }
                    if (index < 0) {
                        visits.push(v);
                    } else {
                        visits[index] = v;
                    }
                    this._store.setValue(this._storedDataName + '.data', JSON.stringify(visits));
                }
            },
            error => console.log(error)
        );
    }

    getVisit (root: string, encounterId: string): Visit {
        let visits: Visit[] = _.map(JSON.parse(this._store.getValue(this._storedDataName + '.data')),
            req => Visit.parseObj(req));

        if (encounterId === null || root === null) {
            return null;
        }

        if (!visits) {
            this._updateVisit(root, encounterId);
            return null;
        }

        let index = _.findIndex(visits, (f) => f.encounterId === encounterId && f.root && root);
        // let request = _.find(requests, (req) => req.requestId === requestId);
        let visit = visits[index];

        console.log('get visit from storage');
        this._updateVisit(root, encounterId, index, visit);
        return visit;
    }
}
