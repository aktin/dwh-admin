/**
 * Created by Xu on 16.05.2017.
 */
import { Component, Input } from '@angular/core';

@Component({
    selector: 'popup-message',
    templateUrl: './popup-message.component.html',
    styleUrls : ['./popup-message.component.css'],
})
export class PopUpMessageComponent {
    @Input() message: string;
    @Input() head: string;
    @Input() callback: Function;
    show = false;

    constructor() {}

    setData (show: boolean, title: string, message: string, callback?: Function): void {
        this.show = show;
        this.head = title;
        this.message = message;
        this.callback = callback;
    }

    closeMessage (): void {
        this.show = false;
        if (this.callback) {
            this.callback();
        }
    }
}
