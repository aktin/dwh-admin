/**
 * Created by Xu on 02.05.2017.
 */
import {AfterViewChecked, Component} from '@angular/core';

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

    serverUrl  = this.url.curServerUrl;

    loggingInState: string;
    select = true;

    msgs: string[] = [];

    constructor (private userService: UserService, private url: UrlService) {
        this.serverUrl = this.url.curServerUrl;
    }


    userLogin (): void {
        this.msgs.length = 0;
        if (!this.username) {
            this.msgs.push('Bitte Nutzername angeben');
            this.loggingInState = 'error';
        }
        if (!this.password) {
            this.msgs.push('Bitte Passwort angeben');
            this.loggingInState = 'error';
        }
        if (this.msgs.length > 0) {
            return;
        }

        this.loggingInState = 'loading';

        this.userService.userLogin(this.username, this.password).subscribe(
            user => {
                this.loggingInState = 'success';
            },
            error => {
                console.error('error? ', error);
                this.msgs.push('Authentifizierungsfehler: ' + error);
                this.loggingInState = 'error';
            }
        );
    }

    userLogout (): void {
        this.userService.userLogout().subscribe(
            () => {
            },
            error => {
                // console.error(error.message)
            },
        );
    }

    serverChange() {
        // console.log(this.serverUrl, s)
        this.url.setServerUrl(this.serverUrl);
    }

    toggleServerSelector(event: Event) {
        let dropDown = $('.server-select.ui.dropdown');
        if (dropDown[0] && dropDown[0].localName === 'select') {
            // first time init
            // this.serverUrl = this.url.curServerUrl;
            dropDown.dropdown({
                allowAdditions: true,
                fullTextSearch: true,
                // onChange: function (value, text, $choice){console.log(value, text, $choice)}
            });

            console.log(this.serverUrl);
        }

        this.select = !this.select;
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
        return this.msgs;
    }

    get serverUrls () {
        return this.url.serverUrls;
    }

    get hideSelect () {
        return this.select;
    }
}
