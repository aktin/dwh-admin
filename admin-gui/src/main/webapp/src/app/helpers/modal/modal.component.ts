import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {ModalService} from './modal.service';

@Component({
    selector: 'modal',
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss'
})
export class ModalComponent implements AfterViewInit {
    @ViewChild('modal', {read: ViewContainerRef})
    private modal!: ViewContainerRef;

    constructor(private modalService: ModalService) {
    }

    ngAfterViewInit() {
        // ensure root modal container is set, so modals can be instantiated
        this.modalService.setRootViewContainerRef(this.modal);
    }
}
