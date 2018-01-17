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
    private filter = 'eav2detailslist';
    private filterFormat = 'html';

    constructor(
        private _http: HttpInterceptorService,
        private _urls: UrlService,
        private _store: StorageService,
        private _download: DownloadService
    ) {}

    private _updateVisit (url: string, root: string, encounterId: string, index = -1, visit: Visit = null): void {
        this._http.debouncedGet<Visit> (
            this._storedDataName + '.' + root + '.' + encounterId,
            visit, null,
            this._dataInterval,
            url ? url : this._urls.parse('visit', {root: root, id: encounterId, filter: this.filter}),
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

                    if (this.filterFormat === 'html') {
                        // format the raw xml input to only hmtl.body
                        console.log('replace xml');
                        let new_v_xml = v.xml.replace(/<\?xml[^>]*\?><html[^>]*>/, '');
                        new_v_xml = new_v_xml.replace(/<body>/, '');
                        new_v_xml = new_v_xml.replace(/<\/body>/, '');
                        new_v_xml = new_v_xml.replace(/<\/html>/, '');
                        v.xml = new_v_xml;
                    }

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
        let url = '';

        url = this._urls.parse('visit', {root: root, id: encounterId, filter: this.filter})

        if (encounterId === null){
            return null;
        }

        if (root === null) {
            url = this._urls.parse('visitId', {id: encounterId, filter: this.filter})
        }
        // add visitId url

        if (!visits) {
            this._updateVisit(url, root, encounterId);
            return null;
        }

        let index = _.findIndex(visits, (f) => f.encounterId === encounterId && f.root && root);
        // let request = _.find(requests, (req) => req.requestId === requestId);
        let visit = visits[index];

        console.log('get visit from storage');
        this._updateVisit(url, root, encounterId, index, visit);
        return visit;
    }
}
