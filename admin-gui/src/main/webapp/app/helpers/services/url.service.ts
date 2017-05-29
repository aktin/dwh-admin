/**
 * Created by Xu on 03.05.2017.
 */
import { Injectable } from '@angular/core';
import _ = require('underscore');

@Injectable()
export class UrlService {
    private serverUrlArray = [
        '/aktin/admin/rest',
        'http://localhost:8080/aktin/admin/rest',
        'http://134.106.36.86:8087/aktin/admin/rest',
    ];
    private serverUrl = this.serverUrlArray[0];
    private endUrls = {
        login : '/auth/login',
        logout : '/auth/logout',
        adminCheck : '/auth/has/admin',
        userCheck : '/auth/check/',
        userUpdate : '/auth/update',

        getUsers : '/users', // get
        editUser : '/users/@user@', // put / delete
        getRoles : '/users/roles', // get
        getUserRoles : '/users/@user@/roles', // get
        editUserRole : '/users/@user@/roles/@role@', // put / delete

        prefs : '/prefs',

        status : '/import-summary',

        reportsList : '/report/archive',
        newMonthlyReport : '/report/monthly/email',
    };

    setServerUrl (serverUrl: string) {
        this.serverUrl = serverUrl;
    }

    get serverUrls (): string[] {
        return this.serverUrlArray;
    }

    get curServerUrl (): string {
        return this.serverUrl;
    }

    /**
     *
     * @param key
     * @param args has the form {user: some user, role: some role}
     * @returns {string}
     */
    parse (key: string, args ?: any): string {
        let endUrl = this.endUrls[key] || key;
        let keys = endUrl.match(/@\w*@/g);
        if (keys && keys.length >= 0) {
            endUrl = _.reduce(
                keys,
                (memo: string, item: string) => {
                    return memo.replace(item, args[/\w+/.exec(item)[0]]);
                },
                endUrl
            );
        }

        return this.serverUrl + endUrl;
    }
}