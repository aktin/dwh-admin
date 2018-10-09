import { Permissions } from './../users/roles';
import { AuthService } from './../users/auth.service';

export class StudyManagerService {

    constructor ( private _auth: AuthService) {}

    checkPermission(permission: string): boolean {
        let perm: Permissions;
        switch (permission) {
            case 'READ_STUDY_MANAGER':
                perm = Permissions.READ_REQUESTS;
                break;
            case 'WRITE_STUDY_MANAGER':
                perm = Permissions.WRITE_REQUESTS;
                break;
            default:
                return false;
        }
        return this._auth.userLocalCheckPermissions([perm]);
    }

}
