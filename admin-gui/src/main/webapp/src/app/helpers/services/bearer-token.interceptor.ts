import {HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StorageService} from "./storage.service";

@Injectable()
export class BearerTokenInterceptor implements HttpInterceptor {
  constructor(private _storageService: StorageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if account is logged in and request is to the api url
    if (this._storageService.getValue('user.token') /* && config.url === getUrl("/auth/login") */ ) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${this._storageService.getValue('user.token')}` }
      })
    }
    // options.headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
    // options.headers.append('Pragma', 'no-cache');
    // options.headers.append('Expires', '0');
    return next.handle(request);
  }
}