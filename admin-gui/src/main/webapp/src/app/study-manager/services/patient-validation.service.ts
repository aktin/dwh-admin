import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, debounceTime, distinctUntilChanged, first, Observable, Subject, tap} from 'rxjs';
import {UrlService} from '../../helpers';
import {Patient} from '../models/patient';
import {map} from 'rxjs/operators';
import {PatientReference} from '../models/patient-reference';
import {Participation} from '../models/participation';

@Injectable({providedIn: 'root'})
export class PatientValidationService {
    private readonly dataSubject$ = new BehaviorSubject<Patient[]>(null);

    private readonly revalidateSubject$ = new Subject<void>();

    /** Subscribe to this in validators to re-run validation on demand. */
    public get revalidate$(): Observable<void> {
        return this.revalidateSubject$.asObservable()
    };

    /** Call this whenever some external event means validators should re-run. */
    public requestRevalidation(): void {
        this.revalidateSubject$.next();
    }

    constructor(private _http: HttpClient,
                private _urls: UrlService) {
    }

    public get validationData$(): Observable<Patient[]> {
        return this.dataSubject$.asObservable();
    }

    public validatePatients$(studyId: string, entries: Patient[]): Observable<Patient[]> {
        return this._http.post<Patient[]>(this._urls.parse('validate', {
            studyId: studyId
        }), toPatientRequests(entries)).pipe(debounceTime(400),
            distinctUntilChanged(),
            map(r => r?.map(e => new Patient(e))),
            tap(r => this.dataSubject$.next(r)));
    }

    public validatePatients(studyId: string, entries: Patient[]): void {
        this.validatePatients$(studyId, entries).subscribe(() => this.requestRevalidation());
    }
}

export interface PatientEntryRequest {
    participation: Participation;
    reference: PatientReference;
    sic?: string;
    extension: string;
    comment?: string;
    generateSic: boolean;
}

export function toPatientRequest(entry: Patient): PatientEntryRequest {
    return {
        participation: entry.participation,
        reference: entry.reference,
        sic: entry.sic,
        extension: entry.extension,
        comment: entry.comment,
        generateSic: entry.generateSic
    };
}

export function toPatientRequests(entries: Patient[]): PatientEntryRequest[] {
    return entries.map(toPatientRequest);
}
