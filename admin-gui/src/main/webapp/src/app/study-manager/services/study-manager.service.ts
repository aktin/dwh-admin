import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';


import {Observable, tap} from 'rxjs';
import {HttpService, UrlService} from '../../helpers';
import {Patient} from '../models/patient';
import {Study} from '../models/study';
import {PatientReference} from '../models/patient-reference';
import {MasterData} from '../models/master-data';
import {Encounter} from '../models/encounter';
import {toPatientRequests} from './patient-validation.service';

@Injectable({providedIn: 'root'})
export class StudyManagerService {
    public preferences: Map<string, string>;

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
            map(studies => studies.map(s => new Study(s)))
        );
    }

    /**
     * Gets all entries that exists for the given study
     * @param studyId The id of the study whose entries should be get.
     * @returns Observable of Entry
     */
    public getEntries(studyId: string): Observable<Patient[]> {
        return this._http.get<Patient[]>(this._urls.parse('entries', {studyId})).pipe(
            map(entries => entries?.map(e => new Patient(e)).sort((a, b) => b.timestamp - a.timestamp)));
    }

    /**
     * Retrieves master data associated with a specific study and patient reference.
     *
     * @param {string} studyId - The unique identifier of the study.
     * @param {PatientReference} ref - The reference information related to the patient.
     * @param {string[]} extensions - A list of extension strings used for the request.
     * @return {Observable<MasterData[]>} An observable that emits an array of MasterData objects.
     */
    public getMasterData(ref: PatientReference, extensions: string[]): Observable<MasterData[]> {
        return this._http.post<MasterData[]>(this._urls.parse('masterdata'), {
            patientReference: ref,
            extensions: extensions
        }).pipe(map(masterData => masterData?.map(m => new MasterData(m))));
    }

    /**
     * Retrieves a list of encounters for the specified study and patient reference.
     *
     * @param {string} studyId - The unique identifier of the study.
     * @param {PatientReference} ref - The reference object for the patient.
     * @param {string[]} extensions - An array of extension identifiers.
     * @return {Observable<Encounter[]>} An observable that emits an array of Encounter objects.
     */
    public getEncounters(ref: PatientReference, extensions: string[]): Observable<Encounter[]> {
        return this._http.post<Encounter[]>(this._urls.parse('encounter'), {
            patientReference: ref,
            extensions: extensions
        }).pipe(map(encounters => encounters?.map(e => new Encounter(e))));
    }

    /**
     * Creates multiple patient records associated with a specific study.
     *
     * @param {string} studyId - The unique identifier of the study to which the patients belong.
     * @param {Patient[]} entries - An array of patient objects to be created.
     * @return {Observable<void>} An observable that emits when the operation is complete.
     */
    public createPatients(studyId: string, entries: Patient[]): Observable<void> {
        return this._http.put<void>(this._urls.parse('multi', {
                studyId: studyId,
            }),
            toPatientRequests(entries),
        );
    }

    /**
     * updates a patient entry to the specified study.
     *
     * @param {string} studyId - The unique identifier of the study to which the patient belongs.
     * @param {string} ref - The reference string associated with the patient entry.
     * @param {string} ext - The extension information related to the patient entry, which will be URL-encoded.
     * @param {Patient} entry - The patient entry object containing details such as participation, SIC, comment, and other metadata.
     * @return {Observable<Patient>} An observable that emits the updated patient object upon successful save.
     */
    public updatePatient(studyId: string, ref: string, ext: string, entry: Patient): Observable<Patient> {
        ext = encodeURIComponent(ext);
        return this._http.patch<Patient>(
            this._urls.parse('entry', {studyId: studyId, reference: ref, extension: ext}), {
                participation: entry.participation,
                sic: entry.sic,
                comment: entry.comment,
                extension: ext,
                reference: ref,
                generateSic: entry.generateSic
            });
    }

    /**
     * Deletes a patient record based on the provided identifiers.
     *
     * @param {string} id - The unique identifier of the study associated with the patient.
     * @param {string} ref - The reference identifier for the patient entry.
     * @param {string} ext - Additional extension information, which will be URL-encoded.
     * @return {Observable<void>} An observable that completes when the deletion is successful.
     */
    deletePatient(id: string, ref: string, ext: string): Observable<void> {
        ext = encodeURIComponent(ext);
        return this._http.delete<void>(this._urls.parse('entry', {
            studyId: id,
            reference: ref,
            extension: ext
        }));
    }
}
