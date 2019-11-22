import { Injectable } from '@angular/core';
// @ts-ignore
import { UrlService } from "@aktin/utils";

@Injectable({
  providedIn: 'root'
})
export class AuthUrlService extends UrlService {

  authUrls = {
    login: "auth/login",
    permissions: "auth/permissions",
  };

  parse(url: string, args?: any): string {
    return super.parse(url, args, this.authUrls);
  }

  get<T>(url: string, args?: any) {
    return super.get<T>(this.parse(url, args));
  }

  post<T> (url: string, body: any, options ?: any, args? : any) {
    return super.post<T> (this.parse(url, args), body, options);
  }
}
