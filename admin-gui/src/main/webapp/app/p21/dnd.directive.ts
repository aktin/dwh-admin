import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: '[dnd]'
})
export class DndDirective {
    @HostBinding('class.fileover') fileOver: boolean;
    @HostBinding('style.background-color') private background = 'rgba(151, 151, 151, 0)';
    @Output() fileDropped = new EventEmitter<any>();

    // listen to drag over and change color
    @HostListener('dragover', ['$event']) onDragOver(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
        this.background = 'rgba(33, 186, 69, 0.1)';
        this.fileOver = true;
    }

    // listen to drag leave and change color
    @HostListener('dragleave', ['$event']) public onDragLeave(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
        this.background = 'rgba(151, 151, 151, 0)';
        this.fileOver = false;
    }

    // listen to drop and run function
    @HostListener('drop', ['$event']) public ondrop(evt: { preventDefault: () => void; stopPropagation: () => void; dataTransfer: { files: any; }; }) {
        this.background = 'rgba(151, 151, 151, 0)';
        this.fileOver = false;
        let files = evt.dataTransfer.files;
        if (files.length > 0) {
            this.fileDropped.emit(files);
        }
    }
}
