import {Injectable, OnInit} from '@angular/core';

declare const $: any;

/**
 * Wrapper for semantic ui toast
 */
@Injectable()
export class NotificationService {
    public showInfo(message: string): void {
        $.toast({
            position: 'bottom center',
            class: 'info',
            message: message,
        });
    }

    public showSuccess(message: string): void {
        $.toast({
            position: 'bottom center',
            class: 'success',
            message: message,
        });
    }

    public showWarning(message: string): void {
        $.toast({
            position: 'bottom center',
            class: 'warning',
            message: message,
        });
    }

    public showError(message: string): void {
        $.toast({
            position: 'bottom center',
            class: 'error',
            message: message,
        });
    }
}
