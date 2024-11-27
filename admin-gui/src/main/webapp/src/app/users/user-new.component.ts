/**
 * Created by Xu on 02-Jun-17.
 */
import {Component, ViewChild} from '@angular/core';

import {PopUpMessageComponent} from '../helpers';

// import 'semantic-ui';

@Component({
    templateUrl: './user-new.component.html',
    styleUrls: ['./users.component.css'],
})
export class UserNewComponent {
    @ViewChild(PopUpMessageComponent) popUp: PopUpMessageComponent;

}
