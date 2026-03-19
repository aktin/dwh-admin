import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

/**
 * allows to store a value as variable in a directive, useful if a value needs to be accessed often
 * declare and use like
 * <div [templateVar]='someValue as myVar'>
 *     <my-element [myDirective]='myVar'></my-element>
 * </div>
 */
@Directive({
    selector: '[templateVar]',
    standalone: true
})
export class TemplateVarDirective {
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

    @Input()
    set templateVar(context: unknown) {
        this.context.$implicit = this.context.templateVar = context;

        if (!this.hasView) {
            this.vcRef.createEmbeddedView(this.templateRef, this.context);
            this.hasView = true;
        }
    }
}
