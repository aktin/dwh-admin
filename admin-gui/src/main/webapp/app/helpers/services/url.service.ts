/**
 * Created by Xu on 03.05.2017.
 */
import { Injectable } from '@angular/core';
import _ = require('underscore');

@Injectable()
export class UrlService {
    private _serverUrls = [
        // 'http://134.106.36.86:8020/aktin/admin/rest/',
        '/aktin/admin/rest/',
    ];
    private _serverUrl = this._serverUrls[0];
    private _endUrls = {
        login : 'auth/login',
        logout : 'auth/logout',
        adminCheck : 'auth/has/admin',
        authCheck : 'auth/check/',
        userUpdate : 'auth/update',
        permissions : 'auth/permissions',

        getUsers : 'users', // get
        editUser : 'users/@user@', // put / delete
        getRoles : 'users/roles', // get
        getUserRoles : 'users/@user@/roles', // get
        editUserRole : 'users/@user@/roles/@role@', // put / delete

        prefs : 'prefs',

        status : 'import-summary',

        reportsList : 'report/archive',
        newMonthlyReport : 'report/monthly/email',
        reportTemplates : 'report/template', // get
        newReport : 'report/template/@templateId@', // post, with start and end in data, json in header

        requestList : 'request',
        request : 'request/@requestId@',
        requestUnmapped : 'request/@requestId@/unmapped',
        requestResult : 'request/@requestId@/result',
        setRequestAutoSubmit: 'request/@requestId@/autoSubmit/@submit@',
        setRequestStatus: 'request/@requestId@/status/@status@',
        setRequestMarker: 'request/@requestId@/marker/@marker@',
        updateRequestMarker: 'request/@requestId@/marker', // put / delete

        setQueryRule : 'request/@requestId@/rule/@action@',
        query : 'query/@queryId@',
        queryRule : 'query/@queryId@/rule', // get/delete
        applyRule : 'query/@queryId@/applyRule',

        // visitList : 'files',
        visit : 'visit/@root@/@id@?xslt=@filter@',
        visitId : 'visit/@id@?xslt=@filter@',
        visitEide : 'visit/',

        studyPrefs : 'optin/preferences',
        studies : 'optin/studies',
        entries : 'optin/@studyId@',
        entry : 'optin/@studyId@/@reference@/@root@/@extension@', // get/post/delete

        // versions endpoint
        version: 'info/version',

        // p21 file data endpoint
        uploadFile: 'file/upload',
        deleteFile: 'file/delete/@uuid@',
        verifyFile: 'file/verify/@uuid@',
        getScripts: 'file/import/scripts',
        importFile: 'file/import/@script@/@uuid@',
    };

    setServerUrl (serverUrl: string) {
        this._serverUrl = serverUrl;
    }

    get serverUrls (): string[] {
        return this._serverUrls;
    }

    get serverUrl (): string {
        return this._serverUrl;
    }

    /**
     *
     * @param url
     * @param args has the form {user: some user, role: some role}
     * @returns {string}
     */
    parse (url: string, args ?: any): string {
        let endUrl = this._endUrls[url] || url;
        let keys = endUrl.match(/@\w*@/g);
        if (keys && keys.length >= 0) {
            endUrl = _.reduce(
                keys,
                (memo: string, item: string) =>  memo.replace(item, args[/\w+/.exec(item)[0]]),
                endUrl
            );
        }

        return this._serverUrl + endUrl;
    }
}
