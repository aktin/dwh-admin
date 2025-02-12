/**
 * Created by Xu on 16.05.2017.
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'popup-message',
    templateUrl: './popup-message.component.html',
    styleUrls : ['./popup-message.component.css'],
})
export class PopUpMessageComponent {
    @Input() message: string;
    @Input() head: string;
    @Input() callback: Function;
    @Input() mode: "info" | "confirm" = 'info'; // 'confirm'
    @Input() button: string[] = ['icon checkmark', 'Weiter', 'green'];
    @Output() onClose: EventEmitter<boolean> = new EventEmitter();
    show = false;
    onTop = false;
    firstChecked = false;
    firstCheckBox: string[];
    secondChecked = false;
    secondCheckBox: string[];

    setData (show: boolean, title: string, message: string, callback?: Function): void {
        this.show = show;
        this.head = title;
        this.message = message;
        this.callback = callback;
    }

    setFirstCheckBox (texts: string[]): void {
        this.firstChecked = true;
        this.firstCheckBox = texts;
    }

    setSecondCheckBox (texts: string[]): void {
        this.secondChecked = true;
        this.secondCheckBox = texts;
    }

    // call after setData
    setConfirm (button?: string[]): void {
        this.mode = 'confirm';
        if (button) {
            this.button = button;
        }
    }

    closeMessage (): void {
        this.show = false;
        if (this.callback) {
            this.callback(false);
        }
        this.onClose.emit(false);
        this.clear();
    }

    msgOk (): void {
        this.show = false;
        if (this.callback) {
            this.callback(true, this.firstChecked, this.secondChecked);
        }
        this.onClose.emit(true);
        this.clear();
    }

    msgCancel (): void {
        this.show = false;
        if (this.callback) {
            this.callback(false);
        }
        this.onClose.emit(false);
        this.clear();
    }

    clear (): void {
        this.message = null;
        this.head = null;
        this.callback = null;
        this.mode = 'info';
        this.show = false;
        this.button = null;
        this.firstChecked = false;
        this.firstCheckBox = null;
        this.secondChecked = false;
        this.secondCheckBox = null;
        this.onTop = false;
    }
}
