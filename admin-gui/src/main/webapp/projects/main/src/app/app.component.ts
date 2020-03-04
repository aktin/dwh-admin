import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Store } from "@ngrx/store";

import { LoadPluginsService } from "@app/core";
import { State, userLocalCheckPermissions } from "@aktin/utils";
import _ from "lodash";
import { AppRouterModule } from "@app/routing/app-router.module";

@Component({
    selector: "admin-gui-root",
    providers: [],
    templateUrl: "./app.component.html",
    styleUrls: [],
})
export class AppComponent implements OnInit {
    visibility: any = {};
    title = "aktin-dwh-admin-gui";
    routes = [];
    
    constructor(
        private _titleService: Title,
        private _router: AppRouterModule,
        private _route: ActivatedRoute,
        private _plugins: LoadPluginsService,
        private _store: Store<State>,
    ) {}
    
    ngOnInit(): void {
        let title = "AKTIN - Adminverwaltung";
        this._titleService.setTitle(title);
        
        // load the external components
        this._plugins.loadConfigFile().then(() => {
            // get plugin routes
            let curRoutes = this._router.addRoutes2Router(this._plugins.routes, this._plugins.routeNames);
            this.setRoutes(curRoutes);
        });
    }
    
    setRoutes(routes) {
        this.routes = _.reduce(
            routes,
            (memo, route) => {
                if (route.data && route.data["name"]) {
                    memo.push(route);
                }
                return memo;
            },
            [],
        );
    }
    
    get routings() {
        _.each(this.routes, route => {
            this.visibility[route.data['name']] = userLocalCheckPermissions(route.data['permissions']);
            // console.log(route.data['name'], route.data, route.data['permissions'], this.visibility[route.data['name']]);
            if (route.hasOwnProperty('children')) {
                let children = route.children;
                for (let i = 0; i < children.length; i++) {
                    if (children[i].hasOwnProperty('data') && children[i].data.hasOwnProperty('name')) {
                        this.visibility[children[i].data['name']] = true;
                    }
                }
            }
        });
        
        return this.routes;
    }
    
    get visible () {
        return this.visibility;
    }
    login() {
        console.log("login?");
    }
}
