import { Injectable }   from '@angular/core';

import { AuthService } from './../users/auth.service';
import { Permission } from '../users';

@Injectable()
export class P21Service {

    constructor(
        private _auth: AuthService,
    ) {}

    sayHello (): void {
        console.log('Hello, I am the P21Service');
    }



    /**
     * Checks if the user has the given permission.
     * @param permission The permission that will be checked.
     * @returns true if user has the permission, false otherwise
     */
    checkPermission(permission: string): boolean {
        let perm: Permission;
        switch (permission) {
            case 'READ_P21':
                // perm = Permission.READ_P21;
                break;
            case 'WRITE_P21':
                // perm = Permission.WRITE_P21;
                break;
            default:
                return false;
        }
        return this._auth.userLocalCheckPermissions([perm]);
    }
}
