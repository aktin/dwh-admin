import { Directive, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';

/**
 * Directive for drag and drop feature
 * runs only inside the <div> annotated with selector
 */

@Directive({
    selector: '[dnd]'
})
export class DndDirective {

    /**
     * HTML and p21.component.ts binding
     */
    @HostBinding('class.fileover') fileOver: boolean;
    @HostBinding('style.background-color') private background = 'rgba(151, 151, 151, 0)';
    @Output() fileDropped = new EventEmitter<any>();

    /**
     * Different HTML listener (drag and mouse)
     * Only for background color change of <div>
     */
    @HostListener('dragover', ['$event']) onDragOver(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
        this.background = 'rgba(33, 186, 69, 0.1)';
        this.fileOver = true;
    }
    @HostListener('mouseover', ['$event']) onMouseOver(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
        this.background = 'rgba(33, 186, 69, 0.1)';
        this.fileOver = true;
    }
    @HostListener('dragleave', ['$event']) public onDragLeave(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
        this.background = 'rgba(151, 151, 151, 0)';
        this.fileOver = false;
    }
    @HostListener('mouseleave', ['$event']) public onMouseLeave(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
        this.background = 'rgba(151, 151, 151, 0)';
        this.fileOver = false;
    }

    /**
     * HTML listener for drop
     * catch dropped files and run p21.component.ts.onFileDropped
     */
    // tslint:disable-next-line:max-line-length
    @HostListener('drop', ['$event']) public ondrop(evt: { preventDefault: () => void; stopPropagation: () => void; dataTransfer: { files: any; }; }) {
        this.background = 'rgba(151, 151, 151, 0)';
        this.fileOver = false;
        let files = evt.dataTransfer.files;
        if (files.length > 0) {
            this.fileDropped.emit(files);
        }
    }
}
