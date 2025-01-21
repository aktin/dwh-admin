/**
 * Created by Xu on 03.05.2017.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class UrlService {
    private _serverUrls = [
        //'http://localhost:81/aktin/admin/rest/',
        '/aktin/admin/rest/',
    ];
    private _serverUrl = this._serverUrls[0];
    private _endUrls: any = {
        login: 'auth/login',
        logout: 'auth/logout',
        adminCheck: 'auth/has/admin',
        authCheck: 'auth/check/',
        userUpdate: 'auth/update',
        permissions: 'auth/permissions',

        getUsers: 'users', // get
        editUser: 'users/@user@', // put / delete
        getRoles: 'users/roles', // get
        getUserRoles: 'users/@user@/roles', // get
        editUserRole: 'users/@user@/roles/@role@', // put / delete

        prefs: 'prefs',

        status: 'import-summary',

        reportsList: 'report/archive',
        newMonthlyReport: 'report/monthly/email',
        reportTemplates: 'report/template', // get
        newReport: 'report/template/@templateId@', // post, with start and end in data, json in header
        deleteReport: 'report/archive/@id@',

        requestList: 'request',
        request: 'request/@requestId@',
        requestUnmapped: 'request/@requestId@/unmapped',
        requestResult: 'request/@requestId@/result',
        setRequestAutoSubmit: 'request/@requestId@/autoSubmit/@submit@',
        setRequestStatus: 'request/@requestId@/status/@status@',
        setRequestMarker: 'request/@requestId@/marker/@marker@',
        updateRequestMarker: 'request/@requestId@/marker', // put / delete

        setQueryRule: 'request/@requestId@/rule/@action@',
        query: 'query/@queryId@',
        queryRule: 'query/@queryId@/rule', // get/delete
        applyRule: 'query/@queryId@/applyRule',

        // visitList : 'files',
        visit: 'visit/@root@/@id@?xslt=@filter@',
        visitId: 'visit/@id@?xslt=@filter@',
        visitEide: 'visit/',

        studyPrefs: 'optin/preferences',
        studies: 'optin/studies',
        entries: 'optin/@studyId@',
        sic: 'optin/@studyId@/@sic@',
        multi: 'optin/entries/@studyId@/@reference@/@root@', //put/post
        entry: 'optin/@studyId@/@reference@/@root@/@extension@', // get/put/post/delete
        masterdata: 'optin/masterdata/@reference@/@root@/@extension@',
        encounter: 'optin/encounter/@reference@/@root@/@extension@',

        // versions endpoint
        version: 'info/version',

        // file import (p21) endpoints
        uploadFiles: 'file',
        uploadFile: 'file/@uuid@',
        importScripts: 'script',
        scriptLogs: 'file/@uuid@/log',
        verifyFile: 'script/@uuid@/verify',
        importFile: 'script/@uuid@/import',
        cancelProcess: 'script/@uuid@/cancel',

        // updateEndpoint
        updateAgentInstalled: 'update/agent/installed',
        updateDWH: 'update',
        getUpdateLog: 'update/log',
        reloadAptPackages: 'update/agent/reload',
    };

    setServerUrl(serverUrl: string) {
        this._serverUrl = serverUrl;
    }

    get serverUrls(): string[] {
        return this._serverUrls;
    }

    get serverUrl(): string {
        return this._serverUrl;
    }

    /**
     *
     * @param url
     * @param args has the form {user: some user, role: some role}
     * @returns {string}
     */
    parse(url: string, args?: any): string {
        let endUrl = this._endUrls[url] || url;
        let keys = endUrl.match(/@\w*@/g);
        if (keys && keys.length >= 0) {
            endUrl = keys.reduce(
                (memo: string, item: string) => memo.replace(item, args[/\w+/.exec(item)[0]]),
                endUrl
            );
        }

        return this._serverUrl + endUrl;
    }
}
