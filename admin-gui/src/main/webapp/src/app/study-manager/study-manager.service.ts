import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';


import {Observable, tap} from 'rxjs';
import {HttpService, UrlService} from '../helpers';
import {Entry} from './entry';
import {Study} from './study';
import {PatientReference} from './patient-reference';
import {MasterData} from './master-data';
import {Encounter} from './encounter';
import {GridModel} from './patients-creation/patients-text-area/patients-text-area.component';
import {Participation} from './participation';

@Injectable({providedIn: 'root'})
export class StudyManagerService {
    public get preferences(): Map<string, string> {
        return JSON.parse(sessionStorage.getItem('studyManager.preferences'));
    };

    private set preferences(preferences: Map<string, string>) {
        sessionStorage.setItem('studyManager.preferences', JSON.stringify(preferences));
    };

    constructor(private _http: HttpService,
                private _urls: UrlService) {
    }

    /**
     * Gets the preferences that are relevant for the consent manager.
     * @returns Observable of the preferences
     */
    public getPreferences(): Observable<Map<string, string>> {
        return this._http.get<Map<string, string>>(this._urls.parse('studyPrefs'))
                   .pipe(tap(p => this.preferences = p));
    }

    /**
     * Gets all available studies from the server.
     * @returns Observable of Study
     */
    public getStudies(): Observable<Study[]> {
        return this._http.get<Study[]>(this._urls.parse('studies')).pipe(
            map(studies => studies.map(s => new Study(s))),
            catchError(err => this._http.handleError(err))
        );
    }

    /**
     * Gets all entries that exists for the given study
     * @param studyId The id of the study whose entries should be get.
     * @returns Observable of Entry
     */
    public getEntries(studyId: string): Observable<Entry[]> {
        return this._http.get<Entry[]>(this._urls.parse('entries', {studyId})).pipe(
            map(entries => entries?.map(e => new Entry(e)).sort((a, b) => b.timestamp - a.timestamp)),
            catchError(err => this._http.handleError(err))
        );
    }

    public getEntryBySic(studyId: string, sic: string): Observable<Entry> {
        return this._http.get<Entry>(this._urls.parse('sic', {studyId, sic})).pipe(
            map(e => !!e ? new Entry(e) : null),
            catchError(err => this._http.handleError(err))
        );
    }

    public getMasterData(ref: PatientReference, root: string, ext: string): Observable<MasterData> {
        root = encodeURIComponent(root);
        ext = encodeURIComponent(ext);
        return this._http.get<MasterData>(this._urls.parse('masterdata', {
            reference: ref,
            root: root,
            extension: ext
        })).pipe(map(m => !!m ? new MasterData(m) : null),
            catchError(err => this._http.handleError(err)));
    }

    public getEncounters(ref: PatientReference, root: string, ext: string): Observable<Encounter[]> {
        root = encodeURIComponent(root);
        ext = encodeURIComponent(ext);
        return this._http.get<Encounter[]>(this._urls.parse('encounter', {
            reference: ref,
            root: root,
            extension: ext
        })).pipe(map(encounters => encounters.map(e => new Encounter(e))),
            catchError(err => this._http.handleError(err)));
    }

    public validateEntries(studyId: string, ref: PatientReference, root: string, entries: GridModel[], generateSic: boolean): Observable<GridModel[]> {
        root = encodeURIComponent(root);
        const extensions = entries.map(e => e.extension);
        const sics = entries.map(e => e.sic);
        return this._http.put<GridModel[]>(this._urls.parse('multi', {
            studyId: studyId,
            reference: ref,
            root: root,
        }), {
            'sics': sics,
            'extensions': extensions,
            'generateSic': generateSic,
        }).pipe(catchError(err => this._http.handleError(err)));
    }

    public createEntries(studyId: string, ref: PatientReference, root: string, entries: GridModel[], participation: Participation, comment: string, generateSic: boolean): Observable<GridModel[]> {
        root = encodeURIComponent(root);
        const extensions = entries.map(e => e.extension);
        const sics = entries.map(e => e.sic);
        return this._http.post<GridModel[]>(this._urls.parse('multi', {
            studyId: studyId,
            reference: ref,
            root: root,
        }), {
            'opt': participation,
            'comment': comment,
            'sics': sics,
            'extensions': extensions,
            'generateSic': generateSic,
        }).pipe(catchError(err => this._http.handleError(err)));
    }

    /**
     * Creates an entry specified by the given studyId, reference, root and extension.
     * @param studyId the id of the study for which the entry should be created
     * @param ref the patient reference
     * @param root the root id
     * @param ext extension id
     * @param opt the participation (optIn or optOut)
     * @param sic the study identification code
     * @param comment the comment to the entry
     * @returns Observable of response
     */
    public createEntry(studyId: string, ref: string, root: string, ext: string, entry: Entry): Observable<Entry> {
        root = encodeURIComponent(root);
        ext = encodeURIComponent(ext);
        return this._http.post<Entry>(
            this._urls.parse('entry', {studyId: studyId, reference: ref, root: root, extension: ext}), {
                'opt': entry.participation,
                'sic': entry.sic,
                'comment': entry.comment
            }).pipe(catchError(err => this._http.handleError(err)));
    }


    /**
     * Deletes an entry specified by the given studyId, reference, root and extension.
     * @param id the id of the study
     * @param ref the patient reference
     * @param root the root id
     * @param ext the extension id
     * @returns Observable of response
     */
    deleteEntry(id: string, ref: string, root: string, ext: string) {
        root = encodeURIComponent(root);
        ext = encodeURIComponent(ext);
        return this._http.delete(this._urls.parse('entry', {
            studyId: id,
            reference: ref,
            root: root,
            extension: ext
        })).pipe(catchError(err => this._http.handleError(err)));
    }

    public updateEntry(studyId: string, reference: PatientReference, root: string, extension: string, entry: Entry): Observable<Entry> {
        root = encodeURIComponent(root);
        extension = encodeURIComponent(extension);
        return this._http.put<Entry>(
            this._urls.parse('entry', {
                studyId: studyId,
                reference: reference,
                root: root,
                extension: extension
            }), {comment: entry.comment}).pipe(catchError(err => this._http.handleError(err)));
    }
}
