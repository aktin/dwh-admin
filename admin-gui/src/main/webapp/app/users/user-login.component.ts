/**
 * Created by Xu on 02.05.2017.
 */
import { Component, Input } from '@angular/core';

import { AuthService } from './auth.service';
import { UrlService, StorageService } from '../helpers/index';
import $ = require('jquery');
require('semantic-ui');

@Component({
    selector: 'user-login',
    templateUrl: './user-login.component.html',
    styleUrls : ['./user-login.component.css'],
})
export class UserLoginComponent {
    @Input () menu = false;
    username: string; // = 'i2b2';
    password: string; // = 'demouser';

    serverUrl  = this._url.serverUrl;
    loggingInState: string;
    private _hideSelect = true;
    private _messages: string[] = [];
    authMessages: string;

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
        this._messages.length = 0;
        if (!this.username) {
            this._messages.push('Bitte Nutzername angeben');
            this.loggingInState = 'error';
        }
        if (!this.password) {
            this._messages.push('Bitte Passwort angeben');
            this.loggingInState = 'error';
        }
        if (this._messages.length > 0) {
            return;
        }

        this.loggingInState = 'loading';

        this._authService.userLogin(this.username, this.password).subscribe(
            ( /*user*/ ) => {
                this.loggingInState = 'success';
                this._hideSelect = true;
                this._authService.redirect2Route();
            },
            error => {
                console.error('error? ', error);
                // this._messages.push('Authentifizierungsfehler: ' + error);
                this._messages.push('Authentifizierungsfehler! Bitte überprüfen Sie Ihre Eingaben!');
                this.loggingInState = 'error';
            }
        );
    }

    userLogout (): void {
        this._authService.userLogout().subscribe(
            ( /*user*/ ) => {
            },
            ( /*error*/ ) => {
                // console.error(error.message)
            },
        );
    }

    serverChange() {
        // console.log(this.serverUrl, s)
        this._url.setServerUrl(this.serverUrl);
    }

    toggleServerSelector() {
        let dropDown = $('.server-select.ui.dropdown');
        if (dropDown[0] && dropDown[0].localName === 'select') {
            // first time init
            dropDown.dropdown({
                allowAdditions: true,
                fullTextSearch: true,
                // onChange: function (value, text, $choice){console.log(value, text, $choice)}
            });
            // console.log('dropdown init',this.serverUrl);
        }
        // console.log('toggling select');
        this._hideSelect = !this._hideSelect;

    }

    get user() {
        return this._authService.userLocal();
    }

    get hasUser () {
        return this._authService.userLocalCheck();
    }

    get logInFormClasses() {
        let classes = {};
        classes[this.loggingInState] = this.loggingInState;
        return classes;
    }

    get messages () {
        return this._messages;
    }

    get serverUrls () {
        return this._url.serverUrls;
    }

    get hideSelect () {
        return this._hideSelect;
    }
}
