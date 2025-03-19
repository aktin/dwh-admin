import {
    AfterViewInit,
    Component,
    ComponentRef,
    ElementRef,
    EnvironmentInjector,
    Injector,
    OnDestroy,
    Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {Subject} from 'rxjs';
import {IModalConfig, MODAL_CONFIG} from './modal.service';

declare var $: any;

@Component({
    selector: 'modal-ref',
    templateUrl: './modal-ref.component.html',
    styleUrls: ['./modal-ref.component.scss']
})
export class ModalRef<T> implements AfterViewInit, OnDestroy {
    @ViewChild('modalContent', {read: ViewContainerRef})
    private modalContent!: ViewContainerRef;

    @ViewChild('modal')
    private modalRef!: ElementRef;

    public afterViewInitFinished$: Subject<void> = new Subject();

    public closed$ = new Subject<any>();
    public destroy$ = new Subject<void>();
    private componentRef: ComponentRef<T>;

    public get instance(): T {
        return this.componentRef.instance;
    }

    constructor(private parentInjector: EnvironmentInjector) {
    }


    ngAfterViewInit() {
        $(this.modalRef.nativeElement).modal({
            closable: false,
            allowMultiple: true,
        });

        this.afterViewInitFinished$.next();
    }

    public open(): void {
        $(this.modalRef.nativeElement).modal('show');
    }

    public close(result?: any): void {
        this.closed$.next(result);

        $(this.modalRef.nativeElement).modal('hide');
    }

    public setContent(componentType: Type<T>, config: IModalConfig = {}): this {
        this.modalContent.clear();

        const injector = Injector.create({
            providers: [{provide: MODAL_CONFIG, useValue: config},
                {provide: ModalRef<T>, useValue: this},],
            parent: this.parentInjector
        });
        this.componentRef = this.modalContent.createComponent(componentType, {injector});

        return this;
    }

    ngOnDestroy() {
        this.modalContent.detach();
        this.modalContent.clear();

        this.destroy$.next();
        this.destroy$.complete();
    }
}
