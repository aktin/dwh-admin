/**
 * Created by Xu on 16.05.2017.
 */
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'popup-message',
    templateUrl: './popup-message.component.html',
    styleUrls : ['./popup-message.component.css'],
})
export class PopUpMessageComponent {
    @Input() message: string;
    @Input() head: string;
    @Input() location: string;
    show = false;

    constructor(private _router: Router) {}

    closeMessage (): void {
        this.show = false;
        if (this.location && this.location !== null) {
            this._router.navigate([this.location]);
        }
    }
}
