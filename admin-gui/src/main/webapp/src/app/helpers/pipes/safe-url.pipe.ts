/**
 * Created by Xu on 18.05.2017.
 */
import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafeUrlPipe implements PipeTransform {
    constructor(private _sanitizer: DomSanitizer) {}
    transform(url: string) {
        return this._sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
