import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {StudyManagerService} from "../services/study-manager.service";

@Injectable({
    providedIn: 'root'
})
export class StudyManagerPreferenceResolver implements Resolve<Map<string, string>> {
    constructor(private studyManagerService: StudyManagerService) {}

    /**
     * Resolves data required for a route before the route is activated.
     *
     * @param {ActivatedRouteSnapshot} route - The activated route snapshot containing route-specific information.
     * @param {RouterStateSnapshot} state - The state of the router at the time of resolution.
     * @return {Observable<Map<string, string>>} An observable that emits a map of preferences as key-value pairs.
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Map<string, string>> {
        return this.studyManagerService.getPreferences();
    }
}
