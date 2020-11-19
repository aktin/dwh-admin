/**
 * Drag n Drop File upload by https://github.com/progtarek/angular-drag-n-drop-directive
 */

import { Component } from '@angular/core';
import { P21Service } from './p21.service';

@Component({
    templateUrl: './p21.component.html',
    styleUrls: ['./p21.component.css'],
})
export class P21Component {

    constructor(private _p21service: P21Service) {
        _p21service.sayHello();
        console.log('Hello, I am the P21Component');
    }

    /**
     * Checks if the user has the given permission.
     * @returns the permission that will be checked
     */
    isAuthorized(permission: string) {
        return this._p21service.checkPermission(permission);
    }
}
