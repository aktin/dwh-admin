import {ComponentRef, Inject, Injectable, InjectionToken, Type, ViewContainerRef} from '@angular/core';
import {ModalRef} from './modal-ref.component';
import {map, Observable, Subject, switchMap, tap} from 'rxjs';
import {DOCUMENT} from '@angular/common';

declare var $: any;

export const MODAL_CONFIG = new InjectionToken<IModalConfig>('MODAL_CONFIG');

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private viewContainerRef!: ViewContainerRef;
    private modalRefs: ModalRef<any>[] = [];

    // event after any modal gets closed
    public modalClosed$ = new Subject<void>();

    /**
     * Set view container ref of ModalComponent
     * @param vcr view container ref
     */
    public setRootViewContainerRef(vcr: ViewContainerRef): void {
        this.viewContainerRef = vcr;
    }

    public open<T>(componentType: Type<T>, config: IModalConfig = {}): Observable<ModalRef<T>> {
        // ensure ViewContainerRef is really set, without it modals cannot be instantiated
        if (!this.viewContainerRef) {
            throw new Error('ViewContainerRef not set. Call setRootViewContainerRef() in your ModalComponent.');
        }

        // instantiate modal
        const componentRef = this.viewContainerRef.createComponent(ModalRef<T>);

        // wait for afterViewInit, so the @ViewChild properties of ModalRef are loaded and modal content can be set
        const obs$ = componentRef.instance.afterViewInitFinished$
                                 .pipe(map(() => componentRef.instance.setContent(componentType, config)),
                                     tap(ref => this.modalRefs.push(ref)));

        obs$.subscribe(() => componentRef.instance.open());

        // clean up after modal gets closed
        obs$.pipe(switchMap(r => r.closed$))
            .subscribe(() => {
                this.modalClosed$.next();
                this.destroyComponent(componentRef);
            });

        return obs$;
    }

    private destroyComponent<T>(modalRef: ComponentRef<ModalRef<T>>): void {
        this.modalRefs = this.modalRefs.filter(m => m !== modalRef.instance);
        modalRef.destroy();

        // ensure all modals are properly closed
        if (!this.modalRefs?.length) {
            $('.ui.modal').modal('hide all');
        }
    }

    public closeAll(): void {
        this.modalRefs.forEach(m => m.close());
    }
}

export interface IModalConfig<TData = any> {
    data?: TData;
    className?: string;
}
