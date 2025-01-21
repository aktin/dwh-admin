import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {StudyManagerService} from "./study-manager.service";

@Injectable({
    providedIn: 'root'
})
export class StudyManagerPreferenceResolver implements Resolve<Map<string, string>> {
    constructor(private studyManagerService: StudyManagerService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Map<string, string>> {
        return this.studyManagerService.getPreferences();
    }
}
