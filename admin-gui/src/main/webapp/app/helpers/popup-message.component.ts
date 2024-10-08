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
    @Input() buttons: string[][] = [['Weiter', 'green'], ['Abbrechen', 'red']];
    show = false;
    onTop = false;
    checkBoxText: string[] = [];
    checkBoxTextQuery: string[] = [];
    checkBoxTextApply: string = null;
    // checkBoxTextMail: string = null;
    checked = false;
    checkedQuery = false;
    checkedApply = false;
    // checkedMail = false;

    setData (show: boolean, title: string, message: string, callback?: Function): void {
        this.show = show;
        this.head = title;
        this.message = message;
        this.callback = callback;
    }

    setOptIn (texts: string[]): void {
        this.checked = true;
        this.checkBoxText = texts;
    }

    setOptQuery (texts: string[]): void {
        this.checkedQuery = true;
        this.checkBoxTextQuery = texts;
    }

    setOptApply (text: string): void {
        this.checkedApply = true;
        this.checkBoxTextApply = text;
    }

    // setoptMail (text: string): void {
    //     this.checkBoxTextMail = text;
    // }

    // call after setData
    setConfirm (buttons?: string[][]): void {
        this.mode = 'confirm';
        if (buttons) {
            this.buttons = buttons;
        }
    }

    closeMessage (): void {
        this.show = false;
        if (this.callback) {
            this.callback(false);
        }
        this.clear();
    }

    msgOk (): void {
        this.show = false;
        if (this.callback) {
            this.callback(true, this.checked, this.checkedQuery, this.checkedApply);
        }
        this.clear();
    }

    msgCancel (): void {
        this.show = false;
        if (this.callback) {
            this.callback(false);
        }
        this.clear();
    }

    clear (): void {
        this.message = null;
        this.head = null;
        this.callback = null;
        this.mode = 'info';
        this.show = false;
        this.buttons = null;
        this.checkBoxText = null;
        this.checkBoxTextQuery = null;
        this.checkBoxTextApply = null;
        // this.checkBoxTextMail = null;
        this.checked = false;
        this.checkedQuery = false;
        this.checkedApply = false;
        // this.checkedMail = false;
        this.onTop = false;
    }
}
