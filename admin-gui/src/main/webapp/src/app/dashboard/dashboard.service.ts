import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';

import {embedDashboard} from '@superset-ui/embedded-sdk';

import {AuthService, Permission} from "../users";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  /**
   * API URL of Superset to send request
   */
  private domain = 'http://localhost:8088';
  private apiUrl = `${this.domain}/api/v1/security`;
  private dashboardId = '';

  constructor(private _auth: AuthService, private _http: HttpClient) {}

  checkPermission(): boolean {
    return this._auth.userLocalCheckPermissions([Permission.DASHBOARD]);
  }

  /**
   *
   * @returns { access token }
   */
  private fetchAccessToken(): Observable<any> {
    //BEARER_TOKEN_SUPER=$(curl -s -X POST "http://localhost:8088/api/v1/security/login" -H "Content-Type: application/json" --data '{ "username": "admin", "password": "admin", "provider": "db" }' | jq -r .access_token)
    //curl -L -X POST "http://localhost:8088/api/v1/security/guest_token" -H 'Content-Type: application/json' -H "Authorization: Bearer $BEARER_TOKEN_SUPER" --data @guest_token_request.json
    const body = {
      'username': 'guest_token_issuer',
      'password': 'guest_token_issuer',
      'provider': 'db',
      'refresh': true
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http.post<any>(`${this.apiUrl}/login`, body, { headers });
  }

  /**
   * @param accessToken
   * @returns { guest token }
   */
  private fetchGuestToken(accessToken: any): Observable<any> {
    const body = {
      'resources': [
        {
          'type': 'dashboard',
          'id': this.dashboardId,
        }
      ],
      'rls': [],
      'user': {
        'username': 'guest',
        'first_name': 'Guest',
        'last_name': 'User',
      }
    };

    // accessToken is an object containing two tokens: access_token and refresh_token,
    // we just need to send access_token to get guest_token
    const acc = accessToken['access_token'];
    if (!acc) {
      throw new Error('No JWT token found in storage');
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${acc}`,
    });

    //guest_token URL should end with forward_slash(/)
    return this._http.post<any>(`${this.apiUrl}/guest_token/`, body, {headers});
  }
  /**
   *
   * @returns { guest token }
   */
  getGuestToken(): Observable<any> {
    return this.fetchAccessToken().pipe(
      catchError((error) => {
        console.error(error);
        return throwError(error);
      }),
      switchMap((accessToken: any) => this.fetchGuestToken(accessToken))
    );
  }
  /**
   *
   * @returns { dashboard service }
   */
  embedDashboard(): Observable<void> {
    return new Observable((observer) => {
      this.getGuestToken().subscribe( {
        next: (token) => {
          embedDashboard({
            id: this.dashboardId,
            supersetDomain: this.domain,
            mountPoint: document.getElementById('dashboard'),
            fetchGuestToken: () => token['token'],
            dashboardUiConfig: {
              hideTitle: true,
              hideChartControls: true,
              hideTab: true,
              filters: {
                expanded: false,
              },
            },
          });
          observer.next();
          observer.complete();
        },
        error: (error) => {
          console.error(error);
          observer.error(error);
        }}
      );
    });
  }
}
