import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { EMPTY, fromEvent } from "rxjs";
import { LocalStorageService } from "@aktin/utils";
import { switchMap, tap } from "rxjs/operators";

@Injectable()
export class AppEffects {
  
    @Effect({dispatch: false})
    desyncedStorage = fromEvent(window, 'storage').pipe (
        tap( () => {console.log(this.storageService.time, this.storageService.synced)})
        // switchMap (() => {
        //
        //     if (this.storageService.isCurrentTime()) {
        //         return EMPTY;
        //     }
        // })
    );
    
    
    constructor(private actions$: Actions, private storageService: LocalStorageService) {}
  }
