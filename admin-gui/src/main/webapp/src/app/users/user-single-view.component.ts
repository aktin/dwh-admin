/**
 * Created by Xu on 15.05.2017.
 */
import {Component, Input} from '@angular/core';
import {User} from './user';

@Component({
    selector: 'user-single-view',
    templateUrl: './user-single-view.component.html',
    styleUrls: ['./users.component.css'],
})

export class UserSingleViewComponent  {
    @Input() userData: User;
    @Input() single = false;
    edit = false;
    editUserData: User;

    constructor() {}

    userChanges (state: string) : void{
        switch (state) {
            case 'save' : {
                console.log('save user');
                console.log(this.userData, this.editUserData);
                break;
            }
            case 'cancel' : {
                console.log('cancel user');
                this.edit = false;
                break;
            }
            case 'reset' : {
                console.log('reset user');
                break;
            }
            default : {
                console.log('default');
                break;
            }
        }
    }

    get user (): User {
        return this.userData;
    }
    get editUser (): User {
        if (!this.editUserData) {
            this.editUserData = JSON.parse(JSON.stringify(this.userData));
        }
        return this.editUserData;
    }
}
