/**
 * Created by Xu on 02.05.2017.
 */
import { Component } from '@angular/core';

import { UserService } from './user.service';
import { UrlService } from '../helpers/index';
import $ = require('jquery');
require('semantic-ui');

@Component({
    selector: 'user-login',
    templateUrl: './user-login.component.html',
    styleUrls : ['./user-login.component.css'],
})
export class UserLoginComponent {

    username = 'i2b2';
    password = 'demouser';

    serverUrl  = this.url.serverUrl;
    loggingInState: string;
    private _hideSelect = true;
    private _messages: string[] = [];

    constructor (private userService: UserService, private url: UrlService) {
        this.serverUrl = this.url.serverUrl;
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

        this.userService.userLogin(this.username, this.password).subscribe(
            ( /*user*/ ) => {
                this.loggingInState = 'success';
                this._hideSelect = true;
            },
            error => {
                console.error('error? ', error);
                this._messages.push('Authentifizierungsfehler: ' + error);
                this.loggingInState = 'error';
            }
        );
    }

    userLogout (): void {
        this.userService.userLogout().subscribe(
            ( /*user*/ ) => {
            },
            ( /*error*/ ) => {
                // console.error(error.message)
            },
        );
    }

    serverChange() {
        // console.log(this.serverUrl, s)
        this.url.setServerUrl(this.serverUrl);
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
        return this.userService.userLocal();
    }

    get hasUser () {
        return this.userService.userLocalCheck();
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
        return this.url.serverUrls;
    }

    get hideSelect () {
        return this._hideSelect;
    }
}
