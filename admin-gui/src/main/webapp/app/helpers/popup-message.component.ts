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
    @Input() mode = 'info'; // 'confirm'
    @Input() buttonText: [string, string] = ['Weiter', 'Abbrechen'];
    show = false;

    constructor() {}

    setData (show: boolean, title: string, message: string, callback?: Function): void {
        this.show = show;
        this.head = title;
        this.message = message;
        this.callback = callback;
    }

    // call after setData
    setConfirm (buttons?: [string, string]): void {
        this.mode = 'confirm';
        if (buttons) {
            this.buttonText = buttons;
        }
    }

    closeMessage (): void {
        this.show = false;
        if (this.callback) {
            this.callback(false);
        }
    }

    msgOk (): void {
        this.show = false;
        if (this.callback) {
            this.callback(true);
        }
    }

    msgCancel (): void {
        this.show = false;
        if (this.callback) {
            this.callback(false);
        }
    }
}
