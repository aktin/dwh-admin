/**
 * Created by Xu on 06.04.2017.
 *
 * Base App Component with layout
 */
import { Component }    from '@angular/core';
import _ = require('underscore');

import { routings }     from './app-routing.module';
import { UserService }  from './users/index';

@Component({
      selector: 'my-app',
      templateUrl: './app.component.html',
})
export class AppComponent {
    visibility: any = {};


    constructor(private userService: UserService) {
    };

    ngOnInit(): void {}

    get routings() {
        _.each(routings, route => {
            this.visibility[route.data['name']] = this.userService.userLocalCheckRoles(route.data['roles']);
        });

        return routings;
    }

    get visible () {
        return this.visibility;
    }
}
