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
        aktinRole : 'auth/role',

        getUsers : 'users', // get
        editUser : 'users/@user@', // put / delete
        getRoles : 'users/roles', // get
        getUserRoles : 'users/@user@/roles', // get
        editUserRole : 'users/@user@/roles/@role@', // put / delete

        prefs : 'prefs',

        status : 'import-summary',

        reportsList : 'report/archive',
        report: 'report/archive/@reportId@/info',
        newMonthlyReport : 'report/monthly/email',
        reportTemplates : 'report/template', // get
        newReport : 'report/template/@templateId@', // post, with start and end in data, json in header

        requestList : 'request',
        request : 'request/@requestId@',
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

        studyPrefs : 'optin/studyPreferences',
        studies : 'optin/studies',
        patientList : 'optin',
        entries : 'optin/@studyId@',
        newPatientEntry : 'optin/addPatientEntry/@studyId@',
        deletePatientEntry : 'optin/deletePatientEntry/@studyId@/@sic@',

        // versions endpoint
        version: 'info/version',
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
