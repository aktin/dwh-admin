/**
 * Created by Xu on 02-Jun-17.
 */
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PopUpMessageComponent } from '../helpers/index';
import { User } from './user';
import { UserService } from './user.service';

require('semantic-ui');

@Component({
    templateUrl: './user-new.component.html',
    styleUrls: ['./users.component.css'],
})
export class UserNewComponent {
    @ViewChild(PopUpMessageComponent) popUp: PopUpMessageComponent;

}
