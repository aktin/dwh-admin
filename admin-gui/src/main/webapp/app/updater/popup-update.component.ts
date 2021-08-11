import { Component, Input } from '@angular/core';
import { UpdaterService } from './updater.service';

@Component({
    selector: 'popup-update',
    templateUrl: './popup-update.component.html',
    styleUrls: ['./popup-update.component.css'],
})
export class PopUpUpdateComponent {
    @Input() head: string;
    @Input() message: string;
    @Input() color_button: string;

    show = false;
    onTop = false;

    constructor(private _updaterService: UpdaterService) {};

    setData(show: boolean, title: string, message: string, color_button: string): void {
        this.show = show;
        this.head = title;
        this.message = message;
        this.color_button = color_button;
    }

    closeMessage(): void {
        this.show = false;
        this.onTop = false;
        this.head = null;
        this.message = null;
        this.color_button = null;
    }
}
