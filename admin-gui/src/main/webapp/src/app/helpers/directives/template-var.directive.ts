import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
    selector: '[templateVar]',
    standalone: true
})
export class TemplateVarDirective {
    @Input()
    set templateVar(context: unknown) {
        this.context.$implicit = this.context.templateVar = context;

        if (!this.hasView) {
            this.vcRef.createEmbeddedView(this.templateRef, this.context);
            this.hasView = true;
        }
    }

    private context: {
        $implicit: unknown;
        templateVar: unknown;
    } = {
        $implicit: null,
        templateVar: null,
    };

    private hasView: boolean = false;

    constructor(
        private templateRef: TemplateRef<any>,
        private vcRef: ViewContainerRef
    ) {
    }
}
