/**
 * Created by Xu on 02.05.2017.
 */
import { Component } from '@angular/core';

import { UserService } from './user.service';

@Component({
    selector: 'user-login',
    templateUrl: './user-login.component.html',
    styleUrls : ['./user-login.component.css'],
})
export class UserLoginComponent {

    username = 'i2b2';
    password = 'demouser';

    loggingIn = false;
    loggingInState: string;

    msgs: string[] = [];

    constructor (private userService: UserService) {}

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
                this.loggingIn = false;
            },
            error => console.error(error.message)
        );
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
}
