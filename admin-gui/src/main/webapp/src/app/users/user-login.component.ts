/**
 * Created by Xu on 02.05.2017.
 */
import {Component, Input, ViewChild} from '@angular/core';

import {AuthService} from './auth.service';
import {StorageService, UrlService} from '../helpers/index';
import $ from "jquery";
import {NgForm} from '@angular/forms';

//require('semantic-ui');

@Component({
    selector: 'user-login',
    templateUrl: './user-login.component.html',
    styleUrls : ['./user-login.component.css'],
})
export class UserLoginComponent {
    @Input () menu = false;
    username: string; // = 'i2b2';
    password: string; // = 'demouser';

    serverUrl: string;
    errorMessages: string[] = [];
    authMessages: string;

    @ViewChild(NgForm)
    private frm: NgForm;

    constructor (private _authService: AuthService,
                 private _url: UrlService,
                 private _store: StorageService) {
        this.serverUrl = this._url.serverUrl;
        let msg = this._store.deleteValue('auth-messages');
        if (msg) {
            this.authMessages = msg;
        }
    }

    userLogin (): void {
        if(this.frm.valid) {
            this._authService.userLogin(this.username, this.password).subscribe({
                next: () => this._authService.redirect2Route(),
                error: () => this.errorMessages.push('Bitte überprüfen Sie Ihren Usernamen oder Passwort')
            });
        }
    }

    userLogout (): void {
        this._authService.userLogout().subscribe();
    }

    get user() {
        return this._authService.userLocal();
    }

    get hasUser () {
        return this._authService.userLocalCheck();
    }
}
