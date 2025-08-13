import {Component, HostBinding, Optional} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
    selector: 'error-message',
    templateUrl: './error-message.component.html',
    styleUrl: './error-message.component.css',
    host: {
        class: 'error-message',
    }
})
export class ErrorMessageComponent {
    constructor(@Optional() private frm: NgForm) {
    }

    private get isSubmitted(): boolean {
        return !this.frm || this.frm?.submitted;
    }

    @HostBinding('style.display')
    public get displayOnSubmit(): string {
        return this.isSubmitted ? 'inherit' : 'none';
    }
}
