import { Component, Input } from '@angular/core';
import { UpdaterService } from './updater.service';

/**
 * Component that displays a popup message for DWH update operations.
 * This component is used to show update status messages, confirmations,
 * and results to the user. It includes a customizable header, message,
 * and a colored button for user interaction.
 */
@Component({
    selector: 'popup-update',
    templateUrl: './popup-update.component.html',
    styleUrls: ['./popup-update.component.css'],
})
export class PopUpUpdateComponent {
    /**
     * The header text to be displayed at the top of the popup.
     * Can be dynamically updated through setData method.
     */
    @Input() head: string;

    /**
     * The main message text to be displayed in the popup body.
     * Can be dynamically updated through setData method.
     */
    @Input() message: string;

    /**
     * The color of the confirmation button.
     * Accepts Semantic UI color classes (e.g., 'green', 'red', 'grey').
     * Can be dynamically updated through setData method.
     */
    @Input() color_button: string;

    /**
     * Controls the visibility of the popup.
     * When true, the popup is displayed; when false, it's hidden.
     */
    show = false;

    /**
     * Controls whether the popup should be displayed on top of other popups.
     * When true, applies a higher z-index to the popup.
     */
    onTop = false;

    /**
     * Creates an instance of PopUpUpdateComponent.
     *
     * @param _updaterService - Service for managing DWH updates and related operations
     */
    constructor(private _updaterService: UpdaterService) {};

    /**
     * Sets the data and visibility state of the popup.
     * Use this method to display the popup with specific content.
     *
     * @param show - Whether to show or hide the popup
     * @param title - The text to display in the popup header
     * @param message - The main message text to display
     * @param color_button - The color class for the confirmation button (e.g., 'green', 'red')
     */
    setData(show: boolean, title: string, message: string, color_button: string): void {
        this.show = show;
        this.head = title;
        this.message = message;
        this.color_button = color_button;
    }

    /**
     * Closes the popup and resets all its data fields.
     * This method is typically called when the user clicks the close button
     * or the confirmation button.
     */
    closeMessage(): void {
        this.show = false;
        this.onTop = false;
        this.head = null;
        this.message = null;
        this.color_button = null;
    }
}
