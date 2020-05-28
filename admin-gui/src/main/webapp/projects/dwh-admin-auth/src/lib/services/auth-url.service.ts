import { Injectable } from '@angular/core';
import { UrlService } from "@aktin/utils";

@Injectable({
    providedIn: 'root'
})
export class AuthUrlService {
    
    constructor(private _url: UrlService) {}
    
    authUrls = {
        login: "auth/login",
        permissions: "auth/permissions",
    
        logout : "auth/logout",
        adminCheck : "auth/has/admin",
        authCheck : "auth/check/",
        userUpdate : "auth/update",
    };
    
    parse(url: string, args?: any): string {
        console.log(this._url.parse(url));
        return this._url.parse(url, args, this.authUrls);
    }
    get<T>(url: string, options?: any , args?: any ) {
        return this._url.get<T>(this.parse(url, args), options);
    }
    
    post<T> (url: string, body: any, options ?: any, args? : any) {
        return this._url.post<T> (this.parse(url, args), body, options);
    }
    
    generateHeaderOptions (key?: string, value?: string, options?: any): any {
        return this._url.generateHeaderOptions(key, value, options);
    }
}
